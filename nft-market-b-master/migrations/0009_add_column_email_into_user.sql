ALTER TABLE "user" ADD CONSTRAINT "idx-user-username" UNIQUE (username);
ALTER TABLE "user" ADD COLUMN email varchar;
UPDATE "user" SET email = CONCAT(username, '@test.mail');
ALTER TABLE "user" ADD CONSTRAINT "idx-user-email" UNIQUE (email);
ALTER TABLE "user" ALTER COLUMN email SET NOT NULL;
ALTER TABLE "user" DROP COLUMN "username";
