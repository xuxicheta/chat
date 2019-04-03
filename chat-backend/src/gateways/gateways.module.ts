import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../api/auth/auth.module';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../common/schemas/message.schema';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { MessagesInterceptor } from './messages.interceptor';
import { MessagesGuard } from './messages.guard';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  providers: [
    MessagesGateway,
    MessagesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MessagesInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: MessagesGuard,
    },
  ],
})
export class GatewaysModule {}
