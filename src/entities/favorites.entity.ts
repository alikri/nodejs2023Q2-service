import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { array: true, nullable: true })
  artists: string[];

  @Column('uuid', { array: true, nullable: true })
  albums: string[];

  @Column('uuid', { array: true, nullable: true })
  tracks: string[];
}
