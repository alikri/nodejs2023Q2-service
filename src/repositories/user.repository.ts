import { Injectable } from '@nestjs/common';
import { BaseRepository } from './in-memory-db/base.repository';
import { User } from '../models/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {}
