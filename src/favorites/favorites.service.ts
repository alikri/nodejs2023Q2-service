import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Album } from 'src/entities/album.entity';
import { Artist } from 'src/entities/artist.entity';
import { Favorites } from 'src/entities/favorites.entity';
import { Track } from 'src/entities/track.entity';
import { FavoritesResponse } from 'src/models/favorites';
import { TrackService } from 'src/track/track.service';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  private readonly hardcodedFavoritesId = 1;
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
  ) {}

  async getFavorites(): Promise<FavoritesResponse | Favorites> {
    let favorites = await this.favoritesRepository.findOne({
      where: { id: this.hardcodedFavoritesId },
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favorites) {
      favorites = new Favorites();
      favorites.id = this.hardcodedFavoritesId;
      favorites.artists = [];
      favorites.albums = [];
      favorites.tracks = [];
      await this.favoritesRepository.save(favorites);
    }

    return favorites;
  }

  async addEntityToFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    const favorites = await this.getFavorites();

    if (!favorites) {
      console.log('Favorites not found');
      return;
    }

    const entity = await this.getEntity(entityType, entityId);
    if (!entity) {
      console.log('Entity not found');
      return;
    }

    if (entityType === 'artists') {
      const artist = entity as Artist;
      if (!favorites.artists.some((e) => e.id === artist.id)) {
        favorites.artists.push(artist);
        await this.artistService.updateArtist(artist.id, artist);
      }
    } else if (entityType === 'albums') {
      const album = entity as Album;
      if (!favorites.albums.some((e) => e.id === album.id)) {
        favorites.albums.push(album);
        await this.albumService.updateAlbum(album.id, album);
      }
    } else if (entityType === 'tracks') {
      const track = entity as Track;
      if (!favorites.tracks.some((e) => e.id === track.id)) {
        favorites.tracks.push(track);
        await this.trackService.updateTrack(track.id, track);
      }
    }

    await this.favoritesRepository.save(favorites);
  }

  async removeEntityFromFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    switch (entityType) {
      case 'artists':
        await this.removeArtistFromFavorites(entityId);
        break;
      case 'albums':
        await this.removeAlbumFromFavorites(entityId);
        break;
      case 'tracks':
        await this.removeTrackFromFavorites(entityId);
        break;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    const favorites = await this.getFavorites();
    if (favorites) {
      favorites.artists = favorites.artists.filter(
        (artist) => artist.id !== artistId,
      );
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    const favorites = await this.getFavorites();
    if (favorites) {
      favorites.albums = favorites.albums.filter(
        (album) => album.id !== albumId,
      );
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    const favorites = await this.getFavorites();
    if (favorites) {
      favorites.tracks = favorites.tracks.filter(
        (track) => track.id !== trackId,
      );
      await this.favoritesRepository.save(favorites);
    }
  }

  private async getEntity(
    type: 'artists' | 'albums' | 'tracks',
    id: string,
  ): Promise<Artist | Album | Track | null> {
    switch (type) {
      case 'artists':
        return this.artistService.getArtistById(id);
      case 'albums':
        return this.albumService.getAlbumById(id);
      case 'tracks':
        return this.trackService.getTrackById(id);
      default:
        throw new Error(`Unsupported entity type: ${type}`);
    }
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
