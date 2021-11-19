export const db = {
    database: process.env.DB_NAME || 'nft',
    user: process.env.DB_USER || 'nftuser',
    password: process.env.DB_PASSWORD || 'nftuser',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5434,
};
