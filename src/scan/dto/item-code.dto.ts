import { IsString } from 'class-validator';

export class ItemCodeDto {
  @IsString()
  code: string;
}
