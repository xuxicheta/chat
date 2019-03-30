import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { TSessionModel } from '../../../src/common/schemas/session.schema';
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
    const existed = await this.userModel.findOne({ username: loginDto.username});
    if (!existed) {
      throw new Error('Not exist');
    }
    if (existed.password !== loginDto.password) {
      throw new Error('Login and password not found');
    }

    const session = this.sessionModel.create({
      createdAt: new Date(),
      expireAt: new Date(Date.now() + this.expiredTime),
      userId: existed._id,
    });

    await existed.updateOne({ lastLoginAt: new Date() });
    return session;
  }

  logout(id: string) {
    return this.sessionModel.findByIdAndDelete(id);
  }

  async findUserIdBySsid(id: string): Promise<string> {
    const session = await this.sessionModel.findById(id);
    if (!session) {
      return null;
    }
    if (session.expireAt.getTime() < Date.now()) {
      await session.remove();
      return null;
    }
    await session.updateOne({ expireAt: new Date(Date.now() + this.expiredTime) });
    return session.userId;
  }
}
