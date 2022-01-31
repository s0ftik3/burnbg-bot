'use strict';

const Markup = require('telegraf/markup');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => (ctx) => {
    try {
        if (!ctx.user.beta) return replyWithError(ctx, 'BETA_ONLY');

        const userFiles = ctx.user.files;
        const cache = ctx.session?.historyCache;

        if (userFiles.length <= 0) {
            return ctx.replyWithHTML(ctx.i18n.t('error.history_empty')).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
        }

        if (cache && userFiles.length === cache.files && ctx.user.language === cache.languageLayout) {
            return ctx
                .replyWithHTML(ctx.i18n.t('service.history', { total: userFiles.length }), {
                    reply_markup: Markup.inlineKeyboard(cache.buttons),
                })
                .catch((err) => {
                    console.error(err);
                    return replyWithError(ctx, 'METHOD_FAILED');
                });
        }

        const lastFiveFiles = userFiles.reverse().slice(0, 5);

        ctx.session.historyCache = { content: lastFiveFiles };

        const buttons = lastFiveFiles.map((e) => {
            const year = new Date(e.timestamp).getFullYear().toString();
            const month = (new Date(e.timestamp).getMonth() + 1).toString().padStart(2, '0');
            const day = new Date(e.timestamp).getDate().toString().padStart(2, '0');
            const hour = new Date(e.timestamp).getHours().toString().padStart(2, '0');
            const minute = new Date(e.timestamp).getMinutes().toString().padStart(2, '0');
            const second = new Date(e.timestamp).getSeconds().toString().padStart(2, '0');

            const buttonName = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

            return [Markup.callbackButton(buttonName, `open:${new Date(e.timestamp).getTime()}`)];
        });

        if (userFiles.length > 5) {
            buttons.push([
                Markup.callbackButton(
                    ctx.i18n.t('button.more', { number: userFiles.length - 5 }),
                    'not_implemented_yet'
                ),
            ]);
        }

        ctx.session.historyCache = {
            ...JSON.parse(JSON.stringify(ctx.session.historyCache)),
            files: userFiles.length,
            languageLayout: ctx.user.language,
            buttons,
        };

        return ctx
            .replyWithHTML(ctx.i18n.t('service.history', { total: userFiles.length }), {
                reply_markup: Markup.inlineKeyboard(buttons),
            })
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
    } catch (err) {
        console.error(err);
    }
};
