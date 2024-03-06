import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from './favorites.repository';
import { UpdateFavoritesDto } from './dto/update-favorites.dto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/models/artist.entity';
import { Album } from 'src/models/album.entity';
import { Track } from 'src/models/track.entity';
import { FavoritesResponse } from 'src/models/favorites.entity';

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
}
