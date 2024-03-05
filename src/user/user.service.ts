import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../models/user.entity';
import { UpdatePasswordDto } from 'src/user/dtos/update-password.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: CreateUserDto): Promise<User> {
    return this.userRepository.create(user);
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(
    id: string,
    userUpdates: Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    const existingUser = await this.findUserById(id);

    const updatedUser = await this.userRepository.update(id, {
      ...existingUser,
      ...userUpdates,
    });
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.findUserById(id);
    await this.userRepository.delete(id);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = await this.userRepository.update(id, {
      ...user,
      password: updatePasswordDto.newPassword,
    });

    return updatedUser;
  }
}
