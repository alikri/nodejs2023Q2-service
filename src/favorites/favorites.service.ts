import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFavoritesDto } from './dto/update-favorites.dto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { FavoritesResponse } from 'src/models/favorites';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorites } from 'src/entities/favorites.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    let favs = await this.favoritesRepository.find({
      relations: ['artists', 'albums', 'tracks'],
      take: 1,
    });

    if (favs.length === 0) {
      const newFavs = this.favoritesRepository.create();
      await this.favoritesRepository.save(newFavs);
      favs = [newFavs];
    }

    const favoritesData = favs[0];
    return {
      artists: favoritesData.artists || [],
      albums: favoritesData.albums || [],
      tracks: favoritesData.tracks || [],
    };
  }

  async addEntityToFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    const favorites = await this.getFavorites();

    let entity = null;
    switch (entityType) {
      case 'artists':
        entity = await this.artistService.getArtistById(entityId);
        break;
      case 'albums':
        entity = await this.albumService.getAlbumById(entityId);
        break;
      case 'tracks':
        entity = await this.trackService.getTrackById(entityId);
        break;
    }

    if (!entity) {
      throw new NotFoundException(
        `${entityType.slice(0, -1)} with ID ${entityId} not found`,
      );
    }

    if (!favorites[entityType].some((e: { id: string }) => e.id === entityId)) {
      favorites[entityType].push(entity);
    }

    await this.favoritesRepository.save(favorites);
  }

  async removeEntityFromFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    const favorites = await this.getFavorites();

    if (!favorites) {
      throw new NotFoundException('Favorites not found');
    }

    switch (entityType) {
      case 'artists':
        favorites.artists = favorites.artists.filter(
          (artist) => artist.id !== entityId,
        );
        break;
      case 'albums':
        favorites.albums = favorites.albums.filter(
          (album) => album.id !== entityId,
        );
        break;
      case 'tracks':
        favorites.tracks = favorites.tracks.filter(
          (track) => track.id !== entityId,
        );
        break;
    }

    await this.favoritesRepository.save(favorites);
  }

  async updateFavorites(
    updateFavoritesDto: UpdateFavoritesDto,
  ): Promise<Favorites> {
    const favorites = await this.favoritesRepository.findOne({
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favorites) {
      throw new NotFoundException('Favorites not found');
    }

    if (updateFavoritesDto.artists) {
      favorites.artists = await this.artistService.findArtistsByIds(
        updateFavoritesDto.artists,
      );
    }
    if (updateFavoritesDto.albums) {
      favorites.albums = await this.albumService.findAlbumsByIds(
        updateFavoritesDto.albums,
      );
    }
    if (updateFavoritesDto.tracks) {
      favorites.tracks = await this.trackService.findTracksByIds(
        updateFavoritesDto.tracks,
      );
    }

    await this.favoritesRepository.save(favorites);
    return favorites;
  }

  async checkEntityExists(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ): Promise<boolean> {
    switch (entityType) {
      case 'artists':
        const artist = await this.artistService.getArtistById(id);
        return !!artist;
      case 'albums':
        const album = await this.albumService.getAlbumById(id);
        return !!album;
      case 'tracks':
        const track = await this.trackService.getTrackById(id);
        return !!track;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }
}
