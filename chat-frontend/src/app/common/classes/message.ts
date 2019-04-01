export class Message {
  text: string;
  createdAt: Date;
  from: string;
  to: string;

  constructor(text: string, from: string, to: string) {
    this.text = text;
    this.createdAt = new Date();
    this.from = from;
    this.to = to;
  }
}
