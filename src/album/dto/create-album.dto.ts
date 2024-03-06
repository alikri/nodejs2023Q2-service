import { IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @IsUUID()
  @IsOptional()
  artistId?: string;
}
