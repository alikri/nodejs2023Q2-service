import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../repositories/in-memory-db/base.repository';
import { User } from '../models/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super();
  }

  override async create(
    item: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'version'>>,
  ): Promise<User> {
    const currentTime = Date.now();
    const newItem: User = {
      ...item,
      id: uuidv4(),
      createdAt: currentTime,
      updatedAt: currentTime,
      version: 1,
    } as User;
    this.entities.set(newItem.id, newItem);
    return newItem;
  }

  override async update(
    id: string,
    item: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'version'>>,
  ): Promise<User> {
    const existingItem = this.entities.get(id);
    if (!existingItem) {
      throw new Error('User not found');
    }
    const updatedItem: User = {
      ...existingItem,
      ...item,
      updatedAt: Date.now(),
      version: existingItem.version + 1,
    };
    this.entities.set(id, updatedItem);

    return updatedItem;
  }
}
