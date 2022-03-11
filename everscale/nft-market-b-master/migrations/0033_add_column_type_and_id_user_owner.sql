CREATE TYPE "account_type" as ENUM ('none','author', 'gallery');
ALTER TABLE "user" ADD COLUMN "account_type" account_type NOT NULL DEFAULT 'none';
ALTER TABLE "user" ADD COLUMN "owner_for_id" int;
