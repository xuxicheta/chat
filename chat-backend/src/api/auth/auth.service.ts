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
    setInterval(() => {
      this.sessionModel.remove({}).where('expiredAd').lt(new Date());
    }, 500000);
  }

  async login(loginDto: LoginDto) {
    const existedUser = await this.userModel.findOne({ username: loginDto.username});
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

    await existedUser.updateOne({ lastLoginAt: new Date() });
    return session;
  }

  logout(id: string) {
    return this.sessionModel.findByIdAndDelete(id);
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
