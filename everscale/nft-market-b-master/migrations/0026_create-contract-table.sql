CREATE TABLE "contract" (
    id SERIAL PRIMARY KEY,
    type varchar,
    code_hash varchar,
    abi jsonb,
    created_at timestamp(0) DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) DEFAULT CURRENT_TIMESTAMP
);
