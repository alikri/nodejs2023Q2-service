import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Favorites } from 'src/entities/favorites.entity';
import { FavoritesResponse } from 'src/models/favorites';
import { TrackService } from 'src/track/track.service';
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

  async getFavorites(): Promise<FavoritesResponse | Favorites> {
    let [favorites] = await this.favoritesRepository.find();

    if (!favorites) {
      favorites = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });
      return await this.favoritesRepository.save(favorites);
    }

    const artists = await Promise.all(
      favorites.artists.map(async (id) => {
        const isExist = await this.checkEntityExists('artists', id);
        if (isExist) {
          return await this.artistService.getArtistById(id);
        }
        return null;
      }),
    );

    const albums = await Promise.all(
      favorites.albums.map(async (id) => {
        const isExist = await this.checkEntityExists('albums', id);
        if (isExist) {
          return await this.albumService.getAlbumById(id);
        }
        return null;
      }),
    );
    const tracks = await Promise.all(
      favorites.tracks.map(async (id) => {
        const isExist = await this.checkEntityExists('tracks', id);
        if (isExist) {
          return await this.trackService.getTrackById(id);
        }
        return null;
      }),
    );

    const result = {
      artists: artists.filter((artist) => artist !== null),
      albums: albums.filter((album) => album !== null),
      tracks: tracks.filter((track) => track !== null),
    };

    return result;
  }

  async addEntityToFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    let [favorites] = await this.favoritesRepository.find();

    if (!favorites) {
      favorites = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });
    }

    if (!favorites[entityType].includes(entityId)) {
      favorites[entityType].push(entityId);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeEntityFromFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    let [favorites] = await this.favoritesRepository.find();

    if (!favorites) {
      favorites = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });
    }

    favorites[entityType] = favorites[entityType].filter(
      (id) => id !== entityId,
    );
    await this.favoritesRepository.save(favorites);
  }

  async checkEntityExists(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ): Promise<boolean> {
    switch (entityType) {
      case 'artists':
        return !!(await this.artistService.getArtistById(id));
      case 'albums':
        return !!(await this.albumService.getAlbumById(id));
      case 'tracks':
        return !!(await this.trackService.getTrackById(id));
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }
}
