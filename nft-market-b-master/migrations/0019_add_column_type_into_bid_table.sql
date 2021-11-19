CREATE TYPE "bid_type" as ENUM ('direct sale','auction');
ALTER TABLE "bid" ADD COLUMN "type" bid_type NOT NULL DEFAULT 'direct sale';
