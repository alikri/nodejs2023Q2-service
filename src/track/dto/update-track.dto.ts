import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  artistId?: string;

  @IsUUID()
  @IsOptional()
  albumId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;
}
