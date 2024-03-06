import {
  Controller,
  Get,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  async addTrackToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    trackId: string,
  ): Promise<any> {
    return this.favoritesService.addEntityToFavorites('tracks', trackId);
  }

  @Post('album/:id')
  async addAlbumToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    albumId: string,
  ): Promise<any> {
    // const album = await this.albumService.getAlbumById(albumId);
    // if (!album) {
    //   throw new NotFoundException(
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //     'Album does not exist',
    //   );
    // }

    this.favoritesService.addEntityToFavorites('albums', albumId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Album added to favorites',
    };
  }

  @Post('artist/:id')
  async addArtistToFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    artistId: string,
  ): Promise<any> {
    this.favoritesService.addEntityToFavorites('artists', artistId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Artist added to favorites',
    };
  }

  @Delete('track/:id')
  async removeTrackFromFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    trackId: string,
  ): Promise<any> {
    await this.favoritesService.removeEntityFromFavorites('tracks', trackId);
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }

  @Delete('album/:id')
  async removeAlbumFromFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    albumId: string,
  ): Promise<any> {
    this.favoritesService.removeEntityFromFavorites('albums', albumId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Album removed from favorites',
    };
  }

  @Delete('artist/:id')
  async removeArtistFromFavorites(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    artistId: string,
  ): Promise<any> {
    this.favoritesService.removeEntityFromFavorites('artists', artistId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Artist removed from favorites',
    };
  }
}
