import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from './artist.repository';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [TrackModule, AlbumModule],
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
  exports: [ArtistService],
})
export class ArtistModule {}
