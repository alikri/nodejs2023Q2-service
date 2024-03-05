import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @Length(8, 100)
  newPassword: string;
}
