CREATE TABLE "nft_token" (
    id SERIAL PRIMARY KEY,
    address varchar UNIQUE NOT NULL,
    wallet_address varchar UNIQUE NOT NULL,
    phrase varchar NOT NULL,
    public_key varchar NOT NULL,
    secret_key varchar NOT NULL,
    contract_id int4 NOT NULL,
    created_at timestamp(0) DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "product" ADD COLUMN "nft_token_id" integer;
