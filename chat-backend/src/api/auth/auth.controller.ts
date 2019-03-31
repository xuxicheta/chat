import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get()
  async testAuth() {
    return 'auth';
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    try {
      const session = await this.authService.login(body);
      return {
        bearer: session._id,
        userId: session.userId,
        expireAt: session.expireAt,
      };
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  async logout(@Request() req) {
    return this.authService.logout(req.user.sessionId).then(() => 'OK');
  }
}
