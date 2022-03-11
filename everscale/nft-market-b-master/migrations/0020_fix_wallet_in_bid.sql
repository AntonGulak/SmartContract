ALTER TABLE "bid" DROP COLUMN "wallet_token";
ALTER TABLE "bid" ADD COLUMN "user_id" integer NOT NULL;

ALTER TABLE "bid" ADD CONSTRAINT "fk-user_id-user-id" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE RESTRICT;