ALTER TABLE "user" ADD COLUMN wallet varchar;
ALTER TABLE "user" ALTER COLUMN email DROP NOT NULL;