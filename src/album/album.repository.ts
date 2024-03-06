import { Album } from '../models/album.entity';
import { BaseRepository } from '../repositories/in-memory-db/base.repository';
import { CreateAlbumDto } from './dto/create-album.dto';
import { v4 as uuidv4 } from 'uuid';

export class AlbumRepository extends BaseRepository<Album> {
  constructor() {
    super();
  }

  override async create(item: CreateAlbumDto): Promise<Album> {
    const id = uuidv4();
    const newItem: Album = {
      id,
      name: item.name,
      year: item.year,
      artistId: item.artistId ?? null,
    };
    this.entities.set(id, newItem);
    return Promise.resolve(newItem);
  }
}
