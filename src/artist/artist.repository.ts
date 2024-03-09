import { BaseRepository } from '../repositories/in-memory-db/base.repository';
import { Artist } from '../models/artist.entity';

export class ArtistRepository extends BaseRepository<Artist> {}
