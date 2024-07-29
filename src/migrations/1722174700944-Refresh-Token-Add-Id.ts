import { randomBytes } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshTokenAddId1722174700944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_token
      ALTER COLUMN id TYPE CHAR(32)
      USING id::CHAR(32)
    `);

    await queryRunner.query(
      `
      UPDATE refresh_token
      SET id = $1
      WHERE id IS NULL
    `,
      [randomBytes(16).toString('hex')],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_token
      ALTER COLUMN id TYPE INTEGER
      USING id::INTEGER
    `);
  }
}
