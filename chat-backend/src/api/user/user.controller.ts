import { Controller, Post, Body, HttpException, HttpStatus, Delete, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { IUser } from '../../../src/common/schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@ApiUseTags('users')
@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  @ApiCreatedResponse({ description: 'OK' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async register(@Body() body: RegisterUserDto): Promise<string> {
    try {
      if (!body.username || !body.password) {
        throw new Error('Wrong parameters');
      }
      await this.userService.create(body);
      return 'OK';
    } catch (error) {
      console.error(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  async list() {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  async one(@Param('userId') userId: string): Promise<IUser> {
    const userDataRaw = await this.userService.findOne(userId);
    const userData = userDataRaw.toJSON();
    await Promise.all(userData.contacts.map(contact =>
      this.authService.findSessionByToken(contact.userId)
        .then(Boolean)
        .then(online => contact.online = online)
        .then(() => contact),
    ));
    return userData;
  }

  @Delete(':userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  async delete(@Param('userId') userId: string) {
    if (!userId) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.userService.delete(userId);
      return 'OK';
    } catch (error) {
      console.error(error);
      throw new HttpException('Not acceptable', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Patch(':userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  async update(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
  ) {
    await this.userService.update(userId, body);
    return 'OK';
  }

}
