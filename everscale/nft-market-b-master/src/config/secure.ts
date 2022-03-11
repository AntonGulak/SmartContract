export const secure = {
    saltRounds: 10,
    tokenSalt: process.env.TOKEN_SALT || 'sjf03fm*(@ojfij9ehf&3',
    tokenLifeTime: 60 * 60 * 24 * 30, // one month
};
