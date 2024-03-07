import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

export class UpdateAlbumDto {
  @ApiProperty({
    type: 'string',
    example: 'Updated Album Name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: 'number',
    example: 2023,
    required: false,
    minimum: 1900,
    maximum: new Date().getFullYear(),
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  year?: number;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string;
}
