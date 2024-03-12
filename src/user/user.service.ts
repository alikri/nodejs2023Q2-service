import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePasswordDto } from 'src/user/dtos/update-password.dto';
import { User } from 'src/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    item: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'version'>>,
  ): Promise<User> {
    const currentTime = Date.now();
    const newItem = this.userRepository.create({
      ...item,
      id: uuidv4(),
      createdAt: currentTime,
      updatedAt: currentTime,
      version: 1,
    });

    return this.userRepository.save(newItem);
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(
    id: string,
    item: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'version'>>,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = this.userRepository.create({
      ...existingUser,
      ...item,
      updatedAt: Date.now(),
      version: existingUser.version + 1,
    });

    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.findUserById(id);

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    await this.userRepository.update(id, {
      password: updatePasswordDto.newPassword,
    });
    return this.userRepository.findOneBy({ id });
  }
}
