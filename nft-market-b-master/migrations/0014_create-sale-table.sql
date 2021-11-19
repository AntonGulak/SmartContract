CREATE TABLE "sale" (
    id SERIAL PRIMARY KEY,
    price decimal(18, 4),
    seller_id integer,
    buyer_id integer,
    item_id integer,
    created_at timestamp(0) DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "sale" ADD CONSTRAINT "fk-seller_id-user-id" FOREIGN KEY (seller_id) REFERENCES "user" (id) ON DELETE RESTRICT;
ALTER TABLE "sale" ADD CONSTRAINT "fk-buyer_id-user-id" FOREIGN KEY (buyer_id) REFERENCES "user" (id) ON DELETE RESTRICT;
