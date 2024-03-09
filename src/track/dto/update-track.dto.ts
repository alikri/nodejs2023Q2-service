import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateTrackDto {
  @ApiProperty({
    type: 'string',
    example: 'Updated Song Name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  albumId?: string;

  @ApiProperty({ type: 'number', example: 320, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;
}
