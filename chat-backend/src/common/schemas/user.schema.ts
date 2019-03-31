import * as mongoose from 'mongoose';

export interface IUser {
  __v?: number;
  _id?: string;
  userId?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  name: string;
  password?: string;
  updatedAt?: Date;
  username: string;
  contacts: string[];
  logged?: number;
}

export const UserSchema = new mongoose.Schema<IUser>({
  username: String,
  password: String,
  name: String,
  lastLoginAt: Date,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  logged: Number,
}, {
  toJSON: { virtuals: true },
  id: false,
});

UserSchema.virtual('userId').get(function() {
  return this._id;
});

export interface IUserModel extends IUser, mongoose.Document {
  _id: string;
}

export type TUserModel = mongoose.Model<IUserModel>;
