CREATE TABLE "gallery" (
    id SERIAL PRIMARY KEY,
    name varchar(255),
    description text,
    image varchar,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

