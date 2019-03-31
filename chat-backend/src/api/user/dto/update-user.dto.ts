import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiModelProperty()
  readonly name?: string;

  @ApiModelProperty()
  readonly contacts?: string[];
}
