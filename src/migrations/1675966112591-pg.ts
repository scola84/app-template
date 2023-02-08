import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class pg1675966112591 implements MigrationInterface {
  name = 'pg1675966112591'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "job" ("data" jsonb, "error" jsonb, "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3) WITH TIME ZONE, "err" integer NOT NULL, "id" SERIAL NOT NULL, "jobId" character varying NOT NULL, "name" character varying NOT NULL, "ok" integer NOT NULL, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "total" integer NOT NULL, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_1302c6cddf76342df00e55d2e6" ON "job" ("jobId") ')
    await queryRunner.query('CREATE TABLE "role" ("createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3) WITH TIME ZONE, "id" SERIAL NOT NULL, "home" character varying NOT NULL, "modes" jsonb NOT NULL, "name" character varying NOT NULL, "scope" character varying, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "user" ("createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3) WITH TIME ZONE, "email" character varying NOT NULL, "home" character varying, "id" SERIAL NOT NULL, "locale" character varying NOT NULL, "loggedInAt" TIMESTAMP(3) WITH TIME ZONE, "name" character varying NOT NULL, "password" character varying, "roleId" integer NOT NULL, "tel" character varying, "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") ')
    await queryRunner.query('CREATE TABLE "user_event" ("code" character varying NOT NULL, "data" jsonb, "id" SERIAL NOT NULL, "message" character varying, "timestamp" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_4245a6b002b13f12e426d9db3ff" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user_event" ADD CONSTRAINT "FK_77452fe8443c349b0e628507cbb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user_event" DROP CONSTRAINT "FK_77452fe8443c349b0e628507cbb"')
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"')
    await queryRunner.query('DROP TABLE "user_event"')
    await queryRunner.query('DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"')
    await queryRunner.query('DROP TABLE "user"')
    await queryRunner.query('DROP TABLE "role"')
    await queryRunner.query('DROP INDEX "public"."IDX_1302c6cddf76342df00e55d2e6"')
    await queryRunner.query('DROP TABLE "job"')
  }
}
