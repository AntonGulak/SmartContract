CREATE TABLE "user_token" (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    token varchar,
    expired_at timestamp(0),
    created_at timestamp(0) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-user_token-user_id"
        FOREIGN KEY(user_id)
            REFERENCES "user" (id)
                ON DELETE CASCADE
);
