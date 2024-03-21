// clearDatabase.ts
import 'dotenv/config';
import AppDataSource from './data-source';

async function clearDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established.');

    await AppDataSource.dropDatabase();
    console.log('Database cleared.');

    await AppDataSource.destroy();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error clearing the database:', error);
    process.exit(1);
  }
}

clearDatabase();
