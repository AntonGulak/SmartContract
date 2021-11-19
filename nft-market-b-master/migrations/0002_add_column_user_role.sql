CREATE TYPE user_role AS ENUM ('user', 'admin');
ALTER TABLE "user" ADD COLUMN role user_role DEFAULT 'user';
INSERT INTO "user" (id, username, role, active, created_at) VALUES (1, 'admin', 'admin', true, '2021-04-18 20:48:00');
