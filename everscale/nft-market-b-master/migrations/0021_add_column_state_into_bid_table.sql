CREATE TYPE "bid_state" as ENUM ('actual','stopped', 'finished');
ALTER TABLE "bid" ADD COLUMN "state" bid_state NOT NULL DEFAULT 'actual';
