import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { TSessionModel, ISession } from '../../../src/common/schemas/session.schema';
import { TUserModel } from '../../../src/common/schemas/user.schema';

@Injectable()
export class AuthService {
  readonly expiredTime = 10 * 60 * 1000;
  constructor(
    @InjectModel('Session') private readonly sessionModel: TSessionModel,
    @InjectModel('User') private readonly userModel: TUserModel,
  ) {
    setInterval(async () => {
      const sessionsToRemove = await this.sessionModel.find({}).where('expiredAd').lt(new Date());
      for (const session of sessionsToRemove) {
        const user = await this.userModel.findById(session.userId);
        user.logged = user.logged ? user.logged - 1 : 0;
        await user.save();
        await session.remove();
        console.log('expired session removed', session.userId);
      }
    }, 30 * 1000);
  }

  async login(loginDto: LoginDto) {
    const existedUser = await this.userModel.findOne({ username: loginDto.username });
    if (!existedUser) {
      throw new Error('Not exist');
    }
    if (existedUser.password !== loginDto.password) {
      throw new Error('Login and password not found');
    }

    const session = this.sessionModel.create({
      createdAt: new Date(),
      expireAt: new Date(Date.now() + this.expiredTime),
      userId: existedUser._id,
      username: existedUser.username,
    });

    existedUser.lastLoginAt = new Date();
    existedUser.logged = (existedUser.logged || 0) + 1;
    await existedUser.save();

    return session;
  }

  async logout(id: string) {
    const session = await this.sessionModel.findById(id);
    const user = await this.userModel.findById(session.userId);
    user.logged = user.logged ? user.logged - 1 : 0; // on case where logged is null -> NaN
    await user.save();
    return session.remove();
  }

  async findSessionByToken(token: string): Promise<ISession> {
    const session = await this.sessionModel.findById(token);
    if (!session) {
      return null;
    }
    if (session.expireAt.getTime() < Date.now()) {
      await session.remove();
      return null;
    }
    await session.updateOne({ expireAt: new Date(Date.now() + this.expiredTime) });
    return session.toJSON();
  }
}
