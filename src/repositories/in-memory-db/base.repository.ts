import { AbstractCrudRepository } from '../abstract-crud-repository.interface';
import { v4 as uuidv4 } from 'uuid';

export class BaseRepository<T extends { id: string }>
  implements AbstractCrudRepository<T, string>
{
  private entities: Map<string, T> = new Map();

  async create(item: Omit<T, 'id'>): Promise<T> {
    const id = uuidv4();
    const newItem = { id, ...item } as T;
    this.entities.set(id, newItem);
    return Promise.resolve(newItem);
  }

  async findById(id: string): Promise<T | null> {
    return Promise.resolve(this.entities.get(id) || null);
  }

  async findAll(): Promise<T[]> {
    return Promise.resolve(Array.from(this.entities.values()));
  }

  async update(id: string, item: Partial<T> & { id: string }): Promise<T> {
    if (!this.entities.has(id)) throw new Error('Item not found');
    const updatedItem = { ...this.entities.get(id), ...item } as T;
    this.entities.set(id, updatedItem);
    return Promise.resolve(updatedItem);
  }

  async delete(id: string): Promise<void> {
    if (!this.entities.delete(id)) throw new Error('Item not found');
    return Promise.resolve();
  }
}
