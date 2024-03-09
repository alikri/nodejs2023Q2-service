import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @Length(2, 30)
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  grammy?: boolean;
}
