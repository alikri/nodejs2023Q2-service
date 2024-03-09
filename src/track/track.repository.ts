import { BaseRepository } from '../repositories/in-memory-db/base.repository';
import { Track } from '../models/track.entity';

export class TrackRepository extends BaseRepository<Track> {
  constructor() {
    super();
  }

  override async update(id: string, item: Partial<Track>): Promise<Track> {
    const existingItem = this.entities.get(id);
    if (!existingItem) {
      return null;
    }
    const updatedItem: Track = {
      ...existingItem,
      ...item,
    };
    this.entities.set(id, updatedItem);

    return updatedItem;
  }

  async findAllTracksByAlbumId(albumId: string): Promise<Track[]> {
    return Array.from(this.entities.values()).filter(
      (track) => track.albumId === albumId,
    );
  }

  async findAllTracksByArtistId(artistId: string): Promise<Track[]> {
    return Array.from(this.entities.values()).filter(
      (track) => track.artistId === artistId,
    );
  }
}
