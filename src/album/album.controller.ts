import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../models/album';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async findAllAlbums(): Promise<Album[]> {
    return this.albumService.findAllAlbums();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the album',
  })
  async getArtistById(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<Album> {
    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Post()
  @ApiBody({
    type: CreateAlbumDto,
    description: 'Create a new album',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({ transform: true, skipMissingProperties: true }),
  )
  @ApiOperation({ summary: 'Update album information' })
  @ApiBody({ type: UpdateAlbumDto, description: 'Payload to update album' })
  async updateAlbum(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the album',
  })
  async deleteArtist(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<void> {
    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    await this.albumService.deleteAlbum(id);
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }
}
