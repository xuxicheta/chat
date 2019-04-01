import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../api/auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [MessagesGateway],
})
export class GatewaysModule {}
