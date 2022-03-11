ALTER TABLE "gallery" ADD COLUMN "owner_id" integer;

ALTER TABLE "gallery" ADD CONSTRAINT "fk-owner_id-user-id" FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE RESTRICT;