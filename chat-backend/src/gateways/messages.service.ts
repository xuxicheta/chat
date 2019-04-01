import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TMessageModel } from '../common/schemas/message.schema';
import { MessageDto } from './dto/messageDto.class';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: TMessageModel,
  ) {}

  saveMessage(messageDto: MessageDto) {
    return this.messageModel.create(messageDto);
  }
}
