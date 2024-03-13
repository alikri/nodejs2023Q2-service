import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigrationTable1710332812760 implements MigrationInterface {
  name = 'InitialMigrationTable1710332812760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`,
    );
    await queryRunner.query(`ALTER TABLE "track" ADD "artistIdId" uuid`);
    await queryRunner.query(`ALTER TABLE "track" ADD "albumIdId" uuid`);
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "artistId"`);
    await queryRunner.query(
      `ALTER TABLE "track" ADD "artistId" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "albumId"`);
    await queryRunner.query(
      `ALTER TABLE "track" ADD "albumId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_817e387c7bc65ab2ecb08f66d7f" FOREIGN KEY ("artistIdId") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_e259e7f86606390730993b2a5a5" FOREIGN KEY ("albumIdId") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_e259e7f86606390730993b2a5a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_817e387c7bc65ab2ecb08f66d7f"`,
    );
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "albumId"`);
    await queryRunner.query(`ALTER TABLE "track" ADD "albumId" uuid`);
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "artistId"`);
    await queryRunner.query(`ALTER TABLE "track" ADD "artistId" uuid`);
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "albumIdId"`);
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "artistIdId"`);
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
