import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Album } from './album.entity';
import { Track } from './track.entity';
import { Favorites } from './favorites.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Track, (track) => track.artist, { onDelete: 'SET NULL' })
  tracks: Track[];

  @OneToMany(() => Album, (album) => album.artist, { onDelete: 'SET NULL' })
  albums: Album[];

  @ManyToOne(() => Favorites, (favorites) => favorites.artists)
  favorites: Favorites;
}
