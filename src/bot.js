const Telegraf = require('telegraf');
const config = require('./config');
const bot = new Telegraf(config.token, { handlerTimeout: config.handler_timeout });

const rateLimit = require('telegraf-ratelimit');
const session = require('telegraf/session');

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});

const attachUser = require('./middlewares/attachUser');
const ignoreOldMessages = require('./middlewares/ignoreOldMessages');

const connect = require('./database/connect');
const resetTokens = require('./database/resetTokens');

const {
    handleStart,
    handlePhoto,
    handleDocument,
    handleSettings,
    handleHistory,
    handleHistoryElement,
    handleToSticker,
    handleService,
    handleLanguage,
    handleText,
    handleReset,
    handleNotImplemented,
    handleFileId,
    handleStatistics,
    handleBeta,
    handleCheck,
    handleBack,
    handleCallback,
} = require('./handlers');

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.use(i18n.middleware());
bot.use(session());
bot.use(ignoreOldMessages());
bot.use(attachUser());
bot.use(rateLimit(config.limit));

bot.start(handleStart());

bot.command('settings', handleSettings());
bot.command('history', handleHistory());
bot.command('reset', handleReset());

bot.command(['statistics', 's'], handleStatistics());
bot.command('beta', handleBeta());
bot.command('check', handleCheck());

bot.action('to_sticker', handleToSticker());
bot.action('service', handleService());
bot.action('language', handleLanguage());
bot.action('yes', handleReset());
bot.action('no', handleReset());
bot.action('not_implemented_yet', handleNotImplemented());
bot.action(/set_language:(.*)/, handleLanguage());
bot.action(/change_service:(.*)/, handleService());
bot.action(/open:(.*)/, handleHistoryElement());
bot.action(/back:(.*)/, handleBack());

bot.hears(config.buttons, handleSettings());
bot.hears(/file_id::/, handleFileId());

bot.on('text', handleText());
bot.on('photo', handlePhoto());
bot.on('document', handleDocument());
bot.on('callback_query', handleCallback());

bot.launch().then(async () => {
    await connect();
    await resetTokens();
    console.log(
        `[${bot.context.botInfo.first_name}] The bot has been started --> https://t.me/${bot.context.botInfo.username}`
    );
});
