// src/albums/album.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly trackService: TrackService,
  ) {}

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };
    const album = this.albumRepository.create({
      ...newAlbum,
    });

    return await this.albumRepository.save(album);
  }

  async findAllAlbums(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async getAlbumById(id: string): Promise<Album | null> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      return null;
    }
    return album;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      return null;
    }
    await this.albumRepository.update(id, updateAlbumDto);

    return await this.getAlbumById(id);
  }

  async deleteAlbum(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    await this.trackService.setAlbumIdToNullForAlbum(id);
  }

  async setArtistIdToNullForAlbum(artistId: string): Promise<void> {
    const albums = await this.albumRepository.find({ where: { artistId } });

    for (const album of albums) {
      await this.albumRepository.update(album.id, { artistId: null });
    }
  }
}
