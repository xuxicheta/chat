import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ServicesModule } from './common/services/services.module';
import { ConfigModule } from './common/modules/config/config.module';
import { DatabaseModule } from './common/modules/database/database.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule,
    ApiModule,
    ServicesModule,
    DatabaseModule,
    MessagesModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [

  ],

})
export class AppModule { }
