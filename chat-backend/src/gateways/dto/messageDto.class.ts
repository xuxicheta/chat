import { IsString, IsDate } from 'class-validator';

export class MessageDto {
  @IsString()
  text: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  from: string;

  @IsString()
  to: string;
}
