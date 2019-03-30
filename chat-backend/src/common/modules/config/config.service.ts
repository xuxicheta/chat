
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(config: { [key: string]: string }) {
    this.envConfig = config;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
