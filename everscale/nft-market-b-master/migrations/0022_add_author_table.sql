CREATE TABLE "author" (
    id SERIAL PRIMARY KEY,
    user_id integer,
    gallery_id integer,
    first_name varchar(255),
    last_name varchar(255),
    avatar varchar,
    nft_addres varchar,
    nft_public_key varchar,
    email varchar,
    description text,
    country varchar,
    city varchar,
    insta varchar,
    fb varchar,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "author" ADD CONSTRAINT "fk-gallery_id-gallery-id" FOREIGN KEY (gallery_id) REFERENCES "gallery" (id) ON DELETE RESTRICT;
ALTER TABLE "author" ADD CONSTRAINT "fk-user_id-user-id" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE RESTRICT;