CREATE TABLE "transaction" (
    id SERIAL PRIMARY KEY,
    wallet_token varchar NOT NULL,
    product_id int NOT NULL,
    price_crystal float,
    operation varchar,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_transaction-product_id"
        FOREIGN KEY(product_id)
            REFERENCES "product"(id)
                ON DELETE CASCADE
);

