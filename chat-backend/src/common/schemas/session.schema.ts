import * as mongoose from 'mongoose';

export interface ISession {
  _id: string;
  createdAt: Date;
  expireAt: Date;
  userId: string;
}

export const SessionSchema = new mongoose.Schema({
  ssid: String,
  createdAt: Date,
  expireAt: Date,
  userId: String,
});

export interface ISessionModel extends mongoose.Document, ISession {
  _id: string;
}

export type TSessionModel = mongoose.Model<ISessionModel>;