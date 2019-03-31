import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService, ENVES } from './config.service';

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envFile = path.join(__dirname, '..', '..', 'environments', `${process.env.NODE_ENV || 'development'}.env`);
const config = fs.existsSync(envFile) ? dotenv.parse(fs.readFileSync(envFile)) : {};

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: ConfigService,
        useValue: new ConfigService(config),
      },
    ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should contains MONGO_ADDRESS', () => {
    expect(service).toHaveProperty('envConfig');
    expect(service.get(ENVES.MONGO_ADDRESS)).toBe
    ();
  });
});
