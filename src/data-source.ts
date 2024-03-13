import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Album } from './entities/album.entity';
import { Artist } from './entities/artist.entity';
import { Favorites } from './entities/favorites.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Artist, Album, Track, Favorites],
  synchronize: false,
  logging: true,
  migrations: ['dist/migrations/*.js'],
});

export default AppDataSource;
