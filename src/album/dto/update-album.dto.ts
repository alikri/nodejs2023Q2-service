import { IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  year?: number;

  @IsUUID()
  @IsOptional()
  artistId?: string;
}
