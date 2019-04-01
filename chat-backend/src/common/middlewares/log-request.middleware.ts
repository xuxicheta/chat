import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as clc from 'cli-color';
import { ConfigService, ENVES } from '../modules/config/config.service';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
  ) { }

  private log(method: string, address: string, body: any) {
    console.log(`${clc.bgMagenta(method)} ${clc.blue(address)} ${JSON.stringify(body)}`);
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (this.configService.get(ENVES.LOG_REQUEST)) {
      this.log(
        req.method,
        req.originalUrl,
        req.body,
      );
    }
    next();
  }
}
