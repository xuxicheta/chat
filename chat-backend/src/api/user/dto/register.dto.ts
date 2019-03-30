import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsAscii, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsAscii()
  @ApiModelProperty()
  @MinLength(5)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @IsAscii()
  @MinLength(5)
  @ApiModelProperty()
  readonly password: string;
}
