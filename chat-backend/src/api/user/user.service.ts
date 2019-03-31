import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TSessionModel } from '../../../src/common/schemas/session.schema';
import { TUserModel, IUser } from '../../../src/common/schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: TSessionModel,
    @InjectModel('User') private readonly userModel: TUserModel,
  ) { }

  findAll() {
    return this.userModel.find({}, '_id username lastLoginAt createdAt');
  }

  findOne(id: string) {
    return this.userModel
      .findById(id, '-__v -password')
      .populate('contacts', 'userId username name');
  }

  async create(loginDto: RegisterUserDto): Promise<IUser> {
    const existed = await this.userModel.findOne({ username: loginDto.username });
    if (existed) {
      throw new Error(`User "${loginDto.username}" already exists`);
    }

    return await this.userModel.create(loginDto);
  }

  async delete(userId: string): Promise<void> {
    await this.sessionModel.deleteMany({ userId });
    await this.userModel.findByIdAndDelete(userId);
  }

  async update(userId: string, userData: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(userId, userData);
  }

  /**
   * uses in e2e test
   */
  getUserModel() {
    return this.userModel;
  }
}
