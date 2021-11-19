ALTER TABLE "offer" DROP COLUMN "state";
ALTER TABLE "sale" DROP COLUMN "operation";
CREATE TYPE offer_state as ENUM ('actual','loser', 'winner');
CREATE TYPE sale_operation as ENUM ('direct sale','auction');
ALTER TABLE "offer" ADD COLUMN "state" offer_state NOT NULL DEFAULT 'actual';
ALTER TABLE "sale" ADD COLUMN "operation" sale_operation NOT NULL DEFAULT 'direct sale';