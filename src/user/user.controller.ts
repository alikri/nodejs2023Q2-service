import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAllUsers();
    return users.map((user) => new UserResponseDto(user));
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the user',
  })
  async getUserById(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findUserById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return new UserResponseDto(user);
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        login: { type: 'string', example: 'nickname' },
        password: { type: 'string', example: 'nickname12345!' },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.createUser(createUserDto);
    return new UserResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string', example: 'nickname12345!' },
        newPassword: { type: 'string', example: 'nickname54321!' },
      },
    },
  })
  async updatePassword(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.updateUserPassword(
      id,
      updatePasswordDto,
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserResponseDto(updatedUser);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
