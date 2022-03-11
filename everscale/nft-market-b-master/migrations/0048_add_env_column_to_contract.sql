CREATE TYPE "env_type" as ENUM ('dev','prod');
ALTER TABLE "contract" ADD COLUMN "env_type" env_type NOT NULL DEFAULT 'dev';
ALTER TABLE "debot_link" ADD COLUMN "env_type" env_type NOT NULL DEFAULT 'dev';
