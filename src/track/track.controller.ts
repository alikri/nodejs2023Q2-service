import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from 'src/models/track.entity';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiBody({
    type: CreateTrackDto,
    description: 'Create a new track',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<any> {
    return this.trackService.createTrack(createTrackDto);
  }

  @Get()
  async getAllTracks(): Promise<any[]> {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  async getTrackById(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<any> {
    const track: Track = await this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update track information' })
  @ApiBody({ type: UpdateTrackDto, description: 'Payload to update a track' })
  async updateTrack(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<any> {
    const updatedTrack = await this.trackService.updateTrack(
      id,
      updateTrackDto,
    );
    if (!updatedTrack) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }
    return updatedTrack;
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a0a659c7-95c8-4c4b-9c5a-69d4e36ba578',
    description: 'The UUID of the user',
  })
  async deleteTrack(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ): Promise<void> {
    const track = await this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }
    await this.trackService.deleteTrack(id);
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }
}
