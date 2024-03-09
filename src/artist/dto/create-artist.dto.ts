import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @Length(2, 30)
  name: string;

  @IsBoolean()
  grammy: boolean;
}
