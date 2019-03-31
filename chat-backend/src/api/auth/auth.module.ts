import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { SessionSchema } from '../../common/schemas/session.schema';
import { HttpStrategy } from './http.strategy';
import { UserSchema } from '../../common/schemas/user.schema';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    HttpStrategy,
  ],
  exports: [
    AuthService,
  ],
  controllers: [
    AuthController,
  ],
})
export class AuthModule {}
