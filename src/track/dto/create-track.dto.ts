import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @ApiProperty({ type: 'string', example: 'Flowers' })
  name: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  artistId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  albumId: string;

  @IsInt()
  @ApiProperty({ type: 'number', example: 202 })
  duration: number;
}
