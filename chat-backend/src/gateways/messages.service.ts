import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TMessageModel, IMessageModel } from '../common/schemas/message.schema';
import { MessageDto } from './dto/messageDto.class';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: TMessageModel,
  ) { }

  saveMessage(messageDto: MessageDto): Promise<IMessageModel> {
    return this.messageModel.create(messageDto);
  }

  getLastMessages(from: string, to: string) {
    return this.messageModel.find().or([{ from, to }, { from: to, to: from }]).sort('createdAt').limit(40);
  }
}
