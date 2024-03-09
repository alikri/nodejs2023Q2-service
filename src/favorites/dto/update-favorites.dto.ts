import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class UpdateFavoritesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  artists?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  albums?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tracks?: string[];
}
