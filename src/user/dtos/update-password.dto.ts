import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: 'string',
    example: 'nickname12345!',
    description: 'The current password of the user.',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    type: 'string',
    example: 'NewPassword456!',
    description: 'The new password for the user. Must not be empty.',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
