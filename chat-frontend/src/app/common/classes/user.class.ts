import { validate, IsNotEmpty, IsAlphanumeric, IsDate, IsString } from 'class-validator';

export class User {
  @IsNotEmpty()
  @IsAlphanumeric()
  userId: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  lastLoginAt: Date;

  @IsDate()
  updatedAt?: Date;

  constructor({ userId, username, name, createdAt, lastLoginAt, updatedAt }: any) {
    this.userId = userId;
    this.username = username;
    this.name = name;
    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.lastLoginAt = lastLoginAt ? new Date(lastLoginAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
    this.validate().then(errors => {
      if (errors.length) {
        console.error('User validation error', errors);
      }
    });
  }

  static empty() {
    return { userId: ''} as User;
  }

  validate() {
    return validate(this, { skipMissingProperties: true });
  }
}
