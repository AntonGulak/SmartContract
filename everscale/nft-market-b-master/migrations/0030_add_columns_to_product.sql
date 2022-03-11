ALTER TABLE "product" ADD COLUMN "video" varchar;
ALTER TABLE "product" ADD COLUMN "year" integer;
ALTER TABLE "product" ADD COLUMN "license" varchar;
ALTER TABLE "product" ADD COLUMN "comission_gallery" integer;
ALTER TABLE "product" ADD COLUMN "comission_author" integer;
ALTER TABLE "product" ADD COLUMN "comission_author_2" integer;

CREATE TYPE "product_type" as ENUM ('video','gif', 'image', 'physical object');
ALTER TABLE "product" ADD COLUMN "type" product_type NOT NULL DEFAULT 'physical object';
ALTER TABLE "product" ADD COLUMN "sub_type_info" varchar;

ALTER TABLE "product" ADD COLUMN "author_table_id" integer;

ALTER TABLE "product" ADD CONSTRAINT "fk-gallery_id-gallery-id" FOREIGN KEY (gallery_id) REFERENCES "gallery" (id) ON DELETE RESTRICT;
ALTER TABLE "product" ADD CONSTRAINT "fk-author_table_id-author-id" FOREIGN KEY (author_table_id) REFERENCES "author" (id) ON DELETE RESTRICT;
