import { IsString } from 'class-validator';

export class RunIdDto {
  @IsString()
  reference: string;
}
