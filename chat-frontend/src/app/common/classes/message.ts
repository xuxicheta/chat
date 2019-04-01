export class Message {
  text: string;
  date: Date;

  constructor(text: string) {
    this.text = text;
    this.date = new Date();
  }
}
