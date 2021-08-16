module.exports = {
    token: process.env.TOKEN,
    host_token: process.env.HOST_TOKEN,
    host_token2: process.env.HOST_TOKEN2,
    host_token3: process.env.HOST_TOKEN3,
    host_token4: process.env.HOST_TOKEN4,
    host_token5: process.env.HOST_TOKEN5,
    host_token6: process.env.HOST_TOKEN6,
    host_token7: process.env.HOST_TOKEN7,
    host_token8: process.env.HOST_TOKEN8,
    host_token9: process.env.HOST_TOKEN9,
    host_token10: process.env.HOST_TOKEN10,
    host2_token: process.env.HOST2_TOKEN,
    database: process.env.DATABASE,
    admin: process.env.ADMIN,
    host: process.env.DATABASE,
    channel: process.env.CHANNEL,
    handler_timeout: 100,
    limit: {
        window: 1500,
        limit: 1,
        onLimitExceeded: (ctx) => require('./src/scripts/replyWithError')(ctx, 1),
    }
};