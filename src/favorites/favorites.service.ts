import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from './favorites.repository';
import { UpdateFavoritesDto } from './dto/update-favorites.dto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/models/artist';
import { Album } from 'src/models/album';
import { Track } from 'src/models/track';
import { FavoritesResponse } from 'src/models/favorites';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly favoritesRepository: FavoritesRepository,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    const favs = this.favoritesRepository.getFavorites();
    const artists = await Promise.all(
      favs.artists.map((id) => this.artistService.getArtistById(id)),
    );
    const albums = await Promise.all(
      favs.albums.map((id) => this.albumService.getAlbumById(id)),
    );
    const tracks = await Promise.all(
      favs.tracks.map((id) => this.trackService.getTrackById(id)),
    );

    return {
      artists: artists.filter((a) => a) as Artist[],
      albums: albums.filter((a) => a) as Album[],
      tracks: tracks.filter((t) => t) as Track[],
    };
  }

  addEntityToFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ): void {
    this.favoritesRepository.addEntity(entityType, id);
  }

  removeEntityFromFavorites(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ) {
    this.favoritesRepository.removeEntityById(entityType, id);
  }

  updateFavorites(updateFavoritesDto: UpdateFavoritesDto) {
    return this.favoritesRepository.updateFavorites(updateFavoritesDto);
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
