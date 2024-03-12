// src/favorites/favorites.repository.ts

import { Injectable } from '@nestjs/common';
import { Favorites } from '../models/favorites';

@Injectable()
export class FavoritesRepository {
  private readonly favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getFavorites(): Favorites {
    return this.favorites;
  }

  addEntity(entityType: 'artists' | 'albums' | 'tracks', id: string): void {
    const entityArray = this.favorites[entityType];
    if (!entityArray.includes(id)) {
      entityArray.push(id);
    }
  }

  updateFavorites(favoritesUpdate: Partial<Favorites>): Favorites {
    if (favoritesUpdate.artists)
      this.favorites.artists = [...favoritesUpdate.artists];
    if (favoritesUpdate.albums)
      this.favorites.albums = [...favoritesUpdate.albums];
    if (favoritesUpdate.tracks)
      this.favorites.tracks = [...favoritesUpdate.tracks];
    return this.favorites;
  }

  removeEntityById(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ): void {
    this.favorites[entityType] = this.favorites[entityType].filter(
      (entityId) => entityId !== id,
    );
  }
}
