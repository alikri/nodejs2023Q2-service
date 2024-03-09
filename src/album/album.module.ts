import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [TrackModule],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
  exports: [AlbumService],
})
export class AlbumModule {}
