import {
  Controller,
  Get,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the track',
  })
  async addTrackToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    trackId: string,
  ): Promise<any> {
    const track = await this.favoritesService.checkEntityExists(
      'tracks',
      trackId,
    );

    if (!track) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return this.favoritesService.addEntityToFavorites('tracks', trackId);
  }

  @Post('album/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the album',
  })
  async addAlbumToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    albumId: string,
  ): Promise<any> {
    const album = await this.favoritesService.checkEntityExists(
      'albums',
      albumId,
    );

    if (!album) {
      throw new HttpException(
        'Album does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.favoritesService.addEntityToFavorites('albums', albumId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Album added to favorites',
    };
  }

  @Post('artist/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the artist',
  })
  async addArtistToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    artistId: string,
  ): Promise<any> {
    const artist = await this.favoritesService.checkEntityExists(
      'artists',
      artistId,
    );

    if (!artist) {
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favoritesService.addEntityToFavorites('artists', artistId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Artist added to favorites',
    };
  }
  @Delete('track/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the track',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    trackId: string,
  ): Promise<void> {
    await this.favoritesService.removeEntityFromFavorites('tracks', trackId);
  }

  @Delete('album/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the album',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    albumId: string,
  ): Promise<void> {
    await this.favoritesService.removeEntityFromFavorites('albums', albumId);
  }

  @Delete('artist/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the artist',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    artistId: string,
  ): Promise<void> {
    await this.favoritesService.removeEntityFromFavorites('artists', artistId);
  }
}
