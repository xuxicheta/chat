import * as mongoose from 'mongoose';

export interface ISession {
  _id: string;
  createdAt: Date;
  expireAt: Date;
  userId: string;
  username: string;
}

export const SessionSchema = new mongoose.Schema({
  ssid: String,
  createdAt: Date,
  expireAt: Date,
  userId: String,
  username: String,
}, {
  toJSON: { virtuals: true },
  id: false,
});

SessionSchema.virtual('sessionId').get(function() {
  return this._id;
});

export interface ISessionModel extends mongoose.Document, ISession {
  _id: string;
}

export type TSessionModel = mongoose.Model<ISessionModel>;
