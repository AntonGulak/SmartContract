CREATE TABLE "product" (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    price decimal(18, 4),
    expire_at timestamp(0),
    image varchar,
    author_id integer,
    owner_id integer,
    for_sale boolean NOT NULL DEFAULT FALSE,
    contract_address varchar,
    description text,
    created_at timestamp(0) DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "product" ADD CONSTRAINT "fk-author_id-user-id" FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE RESTRICT;
ALTER TABLE "product" ADD CONSTRAINT "fk-owner_id-user-id" FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE RESTRICT;
