'use strict';

const Markup = require('telegraf/markup');
const moment = require('moment');
const findFileByTimestamp = require('../database/findFileByTimestamp');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        await ctx.answerCbQuery();

        moment.locale(ctx.user.language);

        const userId = ctx.from.id;
        const cache = ctx.session?.historyCache;
        const timestamp = new Date(Number(ctx.match[0].split(':')[1]));

        if (cache) {
            const file = cache.content.filter(
                (e) => new Date(e.timestamp).getTime() == new Date(timestamp).getTime()
            )[0];

            return ctx
                .editMessageText(
                    ctx.i18n.t('service.history_element', {
                        file_id: 'file_id::' + file.file_id,
                        output: file.output === 'file' ? ctx.i18n.t('other.file') : ctx.i18n.t('other.sticker'),
                        date: moment(file.timestamp).format('LLL'),
                    }),
                    {
                        parse_mode: 'HTML',
                        reply_markup: Markup.inlineKeyboard([
                            Markup.callbackButton(ctx.i18n.t('button.back'), 'back:history'),
                        ]),
                    }
                )
                .catch((err) => {
                    console.error(err);
                    return replyWithError(ctx, 'METHOD_FAILED');
                });
        }

        const file = await findFileByTimestamp(userId, timestamp);

        return ctx
            .editMessageText(
                ctx.i18n.t('service.history_element', {
                    file_id: 'file_id::' + file.file_id,
                    output: file.output === 'file' ? ctx.i18n.t('other.file') : ctx.i18n.t('other.sticker'),
                    date: moment(file.timestamp).format('LLL'),
                }),
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        Markup.callbackButton(ctx.i18n.t('button.back'), 'back:history'),
                    ]),
                }
            )
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
    } catch (err) {
        console.error(err);
    }
};
