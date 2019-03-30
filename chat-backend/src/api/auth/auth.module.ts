import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { SessionSchema } from '../../common/schemas/session.schema';
import { HttpStrategy } from './http.strategy';
import { UserSchema } from '../../common/schemas/user.schema';

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
})
export class AuthModule {}
