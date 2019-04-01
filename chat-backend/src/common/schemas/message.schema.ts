import * as mongoose from 'mongoose';

export interface IMessage {
  _id: string;
  createdAt: Date;
  from: string;
  to: string;
  text: string;
}

export const MessageSchema = new mongoose.Schema({
  createdAt: Date,
  from: String,
  to: String,
  text: String,
}, {
  toJSON: { virtuals: true },
  id: false,
});

MessageSchema.virtual('messageId').get(function() {
  return this._id;
});

export interface IMessageModel extends mongoose.Document, IMessage {
  _id: string;
}

export type TMessageModel = mongoose.Model<IMessageModel>;
