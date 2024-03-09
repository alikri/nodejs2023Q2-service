import { Injectable, NotFoundException } from '@nestjs/common';
import { ArtistRepository } from './artist.repository';
import { Artist } from '../models/artist.entity';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async createArtist(artist: Omit<Artist, 'id'>): Promise<Artist> {
    return this.artistRepository.create(artist);
  }

  async getArtistById(id: string): Promise<Artist | null> {
    return this.artistRepository.findById(id);
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.artistRepository.findAll();
  }

  async updateArtist(
    id: string,
    artistUpdates: Partial<Artist>,
  ): Promise<Artist> {
    return this.artistRepository.update(id, { id, ...artistUpdates });
  }

  async deleteArtist(id: string): Promise<void> {
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    await this.artistRepository.delete(id);

    await this.trackService.setArtistIdToNullForTrack(id);
    await this.albumService.setArtistIdToNullForAlbum(id);
  }
}
