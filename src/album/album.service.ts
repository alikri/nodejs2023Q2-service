// src/albums/album.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { Album } from '../models/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly trackService: TrackService,
  ) {}

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumRepository.create(createAlbumDto);
  }

  async findAllAlbums(): Promise<Album[]> {
    return this.albumRepository.findAll();
  }

  async getAlbumById(id: string): Promise<Album | null> {
    const album = await this.albumRepository.findById(id);
    if (!album) {
      return null;
    }
    return album;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const updatedAlbum = await this.albumRepository.update(
      id,
      updateAlbumDto as Album,
    );
    if (!updatedAlbum) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return updatedAlbum;
  }

  async deleteAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findById(id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    await this.albumRepository.delete(id);
    await this.trackService.setAlbumIdToNullForAlbum(id);
  }

  async setArtistIdToNullForAlbum(artistId: string): Promise<void> {
    const tracks = await this.albumRepository.findAllAlbumsByArtistId(artistId);
    tracks.forEach(async (track) => {
      await this.albumRepository.update(track.id, { ...track, artistId: null });
    });
  }
}
