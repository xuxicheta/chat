import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { envFilePath } from '../../../../path-resolver';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export const envConfig = fs.existsSync(envFilePath)
  ? dotenv.parse(fs.readFileSync(envFilePath))
  : {};

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(envConfig),
    },
  ],
  exports: [
    ConfigService,
  ],
})
export class ConfigModule {}
