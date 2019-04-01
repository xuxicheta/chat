import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../api/auth/auth.module';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../common/schemas/message.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])
  ],
  providers: [MessagesGateway, MessagesService],
})
export class GatewaysModule {}
