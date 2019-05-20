import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../api/auth/auth.module';
import { MessagesService } from './services/messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../common/schemas/message.schema';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { MessagesInterceptor } from './services/messages.interceptor';
import { MessagesGuard } from './services/messages.guard';
import { ActivityService } from './services/activity.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  providers: [
    MessagesGateway,
    MessagesService,
    ActivityService,
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
