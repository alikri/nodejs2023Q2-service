import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Track } from 'src/entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.trackRepository.create({
      ...createTrackDto,
      id: uuidv4(),
    });
    return await this.trackRepository.save(track);
  }

  async getAllTracks(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async getTrackById(id: string): Promise<Track | null> {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      return null;
    }
    return track;
  }

  async updateTrack(id: string, trackUpdates: Partial<Track>): Promise<Track> {
    const track = await this.getTrackById(id);

    if (!track) {
      return null;
    }

    await this.trackRepository.update(id, trackUpdates);
    return await this.getTrackById(id);
  }

  async deleteTrack(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
  }

  async setAlbumIdToNullForAlbum(albumId: string): Promise<void> {
    await this.trackRepository.update({ albumId }, { albumId: null });
  }

  async setArtistIdToNullForTrack(artistId: string): Promise<void> {
    await this.trackRepository.update({ artistId }, { artistId: null });
  }

  async findTracksByIds(ids: string[]): Promise<Track[]> {
    return this.trackRepository.findBy({ id: In(ids) });
  }
}
