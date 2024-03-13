import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Artist } from './artist.entity'; // Assuming Artist entity exists
import { Album } from './album.entity'; // Assuming Album entity exists

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, { nullable: true })
  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Album, { nullable: true })
  @Column({ nullable: true })
  albumId: string | null;

  @Column('int')
  duration: number;
}
