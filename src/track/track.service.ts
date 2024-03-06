import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackRepository } from './track.repository';
import { Track } from '../models/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {
  constructor(private readonly trackRepository: TrackRepository) {}

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackRepository.create(createTrackDto);
  }

  async getAllTracks(): Promise<Track[]> {
    return this.trackRepository.findAll();
  }

  async getTrackById(id: string): Promise<Track> {
    const track = await this.trackRepository.findById(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  async updateTrack(id: string, trackUpdates: Partial<Track>): Promise<Track> {
    const track = this.trackRepository.update(id, { id, ...trackUpdates });
    return track;
  }

  async deleteTrack(id: string): Promise<void> {
    await this.getTrackById(id);
    await this.trackRepository.delete(id);
  }
}
