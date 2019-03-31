import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(id: string): Promise<any> {
    const session = await this.authService.findSessionByToken(id);
    if (!session) {
      throw new UnauthorizedException();
    }
    return session;
  }
}
