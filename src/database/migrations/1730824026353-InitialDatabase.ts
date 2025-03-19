import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDatabase1730824026353 implements MigrationInterface {
  name = 'InitialDatabase1730824026353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("created_at" TIMESTAMP NOT NULL DEFAULT '2024-11-05T16:27:07.454Z', "id" character varying NOT NULL, "uid" integer NOT NULL, "access_token" character varying, "refresh_token" character varying, "fcm_token" character varying, "device_id" character varying, "device_info" character varying, "ip_address" character varying, "last_used_at" character varying DEFAULT '"2024-11-05T16:27:07.454Z"', "expried_at" character varying, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT '2024-11-05T16:27:07.452Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2024-11-05T16:27:07.452Z', "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "type" character varying DEFAULT 'PERSONAL', "usr" character varying NOT NULL, "password" character varying, "PIN" character varying, "usr_type" character varying, "avatar" character varying, "phone_number" character varying, "email" character varying, "login_type" smallint NOT NULL DEFAULT '0', "active" smallint NOT NULL DEFAULT '0', "state" json, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("created_at" TIMESTAMP NOT NULL DEFAULT '2024-11-05T16:27:07.452Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2024-11-05T16:27:07.452Z', "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "uid" integer NOT NULL, "first_nane" character varying, "middle_name" character varying, "last_name" character varying, "fullnane" character varying, "gender" smallint NOT NULL DEFAULT '0', "avatar" character varying, "address" text, "dob" character varying, CONSTRAINT "REL_c71933eb330462616eb77988cd" UNIQUE ("uid"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_9784e6db234ba0d74f8e1d642af" FOREIGN KEY ("uid") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD CONSTRAINT "FK_c71933eb330462616eb77988cd7" FOREIGN KEY ("uid") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_c71933eb330462616eb77988cd7"`);
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_9784e6db234ba0d74f8e1d642af"`);
    await queryRunner.query(`DROP TABLE "user_profile"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
