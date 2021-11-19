CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username varchar NOT NULL,
    password_hash varchar,
    avatar varchar,
    active boolean DEFAULT TRUE,
    created_at timestamp(0) DEFAULT CURRENT_TIMESTAMP
);
