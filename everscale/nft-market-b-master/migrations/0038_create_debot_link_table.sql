CREATE TABLE "debot_link" (
    id SERIAL PRIMARY KEY,
    type varchar,
    link varchar,
    qr_link varchar,
    created_at timestamp(0) DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) DEFAULT CURRENT_TIMESTAMP
);