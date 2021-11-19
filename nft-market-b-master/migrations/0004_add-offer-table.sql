CREATE TABLE "offer" (
    id SERIAL PRIMARY KEY,
    wallet_token varchar,
    product_id int NOT NULL,
    price_crystal float,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP,
    CONSTRAINT "fk_offer-product_id"
        FOREIGN KEY(product_id)
            REFERENCES "product"(id)
                ON DELETE CASCADE
);

