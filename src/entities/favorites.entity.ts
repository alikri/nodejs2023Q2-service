import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Track } from './track.entity';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Artist, (artist) => artist.favorites)
  artists: Artist[];

  @OneToMany(() => Album, (album) => album.favorites)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.favorites, { cascade: true })
  tracks: Track[];
}
