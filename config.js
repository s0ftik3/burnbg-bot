module.exports = {
    token: process.env.TOKEN,
    host_token: process.env.HOST_TOKEN,
    database: process.env.DATABASE,
    admin: process.env.ADMIN,
    host: process.env.HOST,
    handler_timeout: 100,
    limit: {
        window: 1500,
        limit: 1,
        onLimitExceeded: (ctx) => require('./src/scripts/replyWithError')(ctx, 1),
    }
};