ALTER TABLE "offer" DROP COLUMN "wallet_token";
ALTER TABLE "offer" ADD COLUMN "user_id" integer NOT NULL;

ALTER TABLE "offer" ADD CONSTRAINT "fk-user_id-user-id" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE RESTRICT;