export enum ENVES {
  MONGO_ADDRESS = 'MONGO_ADDRESS',
  LOG_REQUEST = 'LOG_REQUEST',
}

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(
    config: { [key: string]: string, }
    ) {
    this.envConfig = config;
  }

  get(key: ENVES): string {
    return this.envConfig[key];
  }
}
