'use strict';

const Markup = require('telegraf/markup');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => (ctx) => {
    try {
        const userFiles = ctx.user.files;

        if (userFiles.length <= 0) {
            return ctx.replyWithHTML(ctx.i18n.t('error.history_empty')).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
        }

        const lastEightFiles = userFiles.reverse().slice(0, 5);

        const buttons = lastEightFiles.map((e) => {
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
