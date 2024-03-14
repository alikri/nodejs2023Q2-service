import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from './album.entity';
import { Track } from './track.entity';

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
}
