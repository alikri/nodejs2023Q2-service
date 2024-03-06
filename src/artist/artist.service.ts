import { Injectable } from '@nestjs/common';
import { ArtistRepository } from './artist.repository';
import { Artist } from '../models/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly artistRepository: ArtistRepository) {}

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
    return this.artistRepository.delete(id);
  }
}
