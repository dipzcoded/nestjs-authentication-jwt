import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  userName: string;
}
