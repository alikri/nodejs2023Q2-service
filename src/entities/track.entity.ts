import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist)
  artist: Artist;

  @ManyToOne(() => Album)
  album: Album;

  @Column()
  duration: number;
}
