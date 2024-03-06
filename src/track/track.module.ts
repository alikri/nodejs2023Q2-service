import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackRepository } from './track.repository';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
})
export class TrackModule {}
