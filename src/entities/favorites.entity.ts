import { Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Track } from './track.entity';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];
}
