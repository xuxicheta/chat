import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from '../auth/dto/login.dto';
import { TSessionModel } from '../../../src/common/schemas/session.schema';
import { TUserModel, IUser } from '../../../src/common/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: TSessionModel,
    @InjectModel('User') private readonly userModel: TUserModel,
  ) {}

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async create(loginDto: LoginDto): Promise<IUser> {
    const existed = await this.userModel.findOne({ username: loginDto.username });
    if (existed) {
      throw new Error(`User ${loginDto} already exists`);
    }

    return await this.userModel.create({
      ...loginDto,
      createdAt: new Date(),
      lastLoginAt: null,
      name: loginDto.username,
      updatedAt: new Date(),
    });
  }

  async delete(userId: string): Promise<void> {
    await this.sessionModel.deleteMany({userId });
    await this.userModel.findByIdAndDelete(userId);
  }

  getUserModel() {
    return this.userModel;
  }
}
