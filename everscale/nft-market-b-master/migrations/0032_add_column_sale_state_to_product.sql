CREATE TYPE "sale_state" as ENUM ('no','direct sale', 'auction');
ALTER TABLE "product" ADD COLUMN "sale_state" sale_state NOT NULL DEFAULT 'no';
