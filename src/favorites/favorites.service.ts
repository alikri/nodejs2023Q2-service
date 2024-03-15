import { Injectable, NotFoundException } from '@nestjs/common';
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
    const favorites = await this.favoritesRepository.findOne({
      where: {},
    });
    if (!favorites) {
      const newFavorites = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });
      await this.favoritesRepository.save(newFavorites);

      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    } else {
      const artistsArray =
        favorites.artists.length > 0
          ? await this.artistService.findArtistsByIds(favorites.artists)
          : [];
      const albumsArray =
        favorites.albums.length > 0
          ? await this.albumService.findAlbumsByIds(favorites.albums)
          : [];
      const tracksArray =
        favorites.tracks.length > 0
          ? await this.trackService.findTracksByIds(favorites.tracks)
          : [];

      return {
        artists: artistsArray,
        albums: albumsArray,
        tracks: tracksArray,
      };
    }
  }

  async addEntityToFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    const favorites = await this.favoritesRepository.findOne({
      where: {},
    });

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

    const entityExistsInFavorites = favorites[entityType].includes(entityId);
    if (!entityExistsInFavorites) {
      favorites[entityType].push(entityId);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeEntityFromFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    const favorites = await this.favoritesRepository.findOne({
      where: {},
    });

    if (!favorites) {
      throw new NotFoundException('Favorites not found');
    }

    if (entityType === 'artists') {
      favorites.artists = favorites.artists.filter((id) => id !== entityId);
    } else if (entityType === 'albums') {
      favorites.albums = favorites.albums.filter((id) => id !== entityId);
    } else if (entityType === 'tracks') {
      favorites.tracks = favorites.tracks.filter((id) => id !== entityId);
    }

    await this.favoritesRepository.save(favorites);
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
