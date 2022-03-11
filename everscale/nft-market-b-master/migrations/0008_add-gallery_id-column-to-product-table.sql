ALTER TABLE "product" ADD
    COLUMN gallery_id int;
ALTER TABLE "product" ADD
    CONSTRAINT "fk_product-gallery_id"
        FOREIGN KEY(gallery_id)
        REFERENCES "gallery"(id);

