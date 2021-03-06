import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ServicesModule } from './common/services/services.module';
import { ConfigModule } from './common/modules/config/config.module';
import { DatabaseModule } from './common/modules/database/database.module';
import { GatewaysModule } from './gateways/gateways.module';
import { LogRequestMiddleware } from './common/middlewares/log-request.middleware';

@Module({
  imports: [
    ConfigModule,
    ApiModule,
    ServicesModule,
    DatabaseModule,
    GatewaysModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [

  ],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogRequestMiddleware)
      .forRoutes('*');
  }
}
