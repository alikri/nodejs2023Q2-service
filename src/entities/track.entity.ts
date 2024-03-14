import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.tracks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Album)
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @Column({ nullable: true })
  albumId: string | null;

  @Column('int')
  duration: number;
}
