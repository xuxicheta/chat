import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../common/schemas/user.schema';
import { ServicesModule } from '../../common/services/services.module';
import { SessionSchema } from '../../common/schemas/session.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ServicesModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
    AuthModule,
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}
