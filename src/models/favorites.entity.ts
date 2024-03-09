import { Album } from './album.entity';
import { Artist } from './artist.entity';
import { Track } from './track.entity';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
