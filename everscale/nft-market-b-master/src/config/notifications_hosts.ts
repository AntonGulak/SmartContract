export const notifications_hosts = {
    smtp: {
        title: process.env.SMTP_TITLE || "Blue Bumblebee NFT Market",
        host: process.env.SMTP_HOST || "smtp.email-example.com",
        user: process.env.SMTP_USER || "nft-market-b@email-example.com",
        password: process.env.SMTP_PASSWORD || "password example",
        port: Number(process.env.SMTP_PORT) || 465,
        certificate: process.env.SMTP_CERT || "ssl"
    }
};
