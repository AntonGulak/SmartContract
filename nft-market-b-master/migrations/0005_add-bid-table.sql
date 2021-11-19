CREATE TABLE "bid" (
    id SERIAL PRIMARY KEY,
    wallet_token varchar NOT NULL,
    product_id int NOT NULL,
    price_crystal float,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP,
    CONSTRAINT "fk_bid-product_id"
        FOREIGN KEY(product_id)
            REFERENCES "product"(id)
                ON DELETE CASCADE
);

