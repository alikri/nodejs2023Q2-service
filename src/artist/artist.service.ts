import { Injectable, NotFoundException } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/entities/artist.entity';
import { In, Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    const artist = this.artistRepository.create({
      ...newArtist,
    });

    return await this.artistRepository.save(artist);
  }

  async getArtistById(id: string): Promise<Artist | null> {
    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      return null;
    }
    return artist;
  }

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async updateArtist(
    id: string,
    artistUpdates: Partial<Artist>,
  ): Promise<Artist> {
    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      return null;
    }
    await this.artistRepository.update(id, artistUpdates);

    return await this.getArtistById(id);
  }

  async deleteArtist(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    await this.trackService.setArtistIdToNullForTrack(id);
    await this.albumService.setArtistIdToNullForAlbum(id);
  }

  async findArtistsByIds(ids: string[]): Promise<Artist[]> {
    return this.artistRepository.findBy({ id: In(ids) });
  }
}
