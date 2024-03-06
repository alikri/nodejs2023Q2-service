import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from '../models/artist.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists(): Promise<Artist[]> {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtistById(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<Artist> {
    const artist = await this.artistService.getArtistById(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createArtist(@Body() artistDto: CreateArtistDto): Promise<Artist> {
    return this.artistService.createArtist(artistDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateArtist(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() artistUpdatesDto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = await this.artistService.getArtistById(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return this.artistService.updateArtist(id, artistUpdatesDto);
  }

  @Delete(':id')
  async deleteArtist(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<void> {
    const artist = await this.artistService.getArtistById(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    await this.artistService.deleteArtist(id);
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }
}
