import * as mongoose from 'mongoose';

export interface IUser {
  __v?: number;
  _id?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  name: string;
  password?: string;
  updatedAt?: Date;
  username: string;
}

export const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date,
});

export interface IUserModel extends IUser, mongoose.Document {
  _id: string;
}

export type TUserModel = mongoose.Model<IUserModel>;
