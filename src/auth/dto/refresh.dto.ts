import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;

  @IsOptional()
  @IsString()
  device_model?: string;

  @IsString()
  @IsOptional()
  device_os?: string;
}
