import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  account: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  device_model?: string;

  @IsString()
  @IsOptional()
  device_os?: string;
}
