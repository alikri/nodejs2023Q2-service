import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    type: 'string',
    description: 'Name of the album',
    example: 'The Dark Side of the Moon',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    description: 'Release year of the album',
    minimum: 1900,
    maximum: new Date().getFullYear(),
    example: 1973,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Artist ID associated with the album',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  artistId?: string;
}
