export interface IMessage {
  text: string;
  createdAt: Date;
  from: string;
  to: string;
}

export class Message implements IMessage {
  text: string;
  createdAt: Date;
  from: string;
  to: string;

  constructor(input: IMessage) {
    this.text = input.text;
    this.createdAt = new Date(input.createdAt);
    this.from = input.from;
    this.to = input.to;
  }
}
