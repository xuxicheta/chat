import { Controller, Post, Body, HttpException, HttpStatus, Delete, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { IUser } from '../../../src/common/schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiUseTags('users')
@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
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
    return this.userService.findOne(userId);
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
