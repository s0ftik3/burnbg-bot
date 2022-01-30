'use strict';

const Markup = require('telegraf/markup');
const moment = require('moment');
const findFileByTimestamp = require('../database/findFileByTimestamp');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        await ctx.answerCbQuery();

        const userId = ctx.from.id;
        const timestamp = new Date(Number(ctx.match[0].split(':')[1]));

        const file = await findFileByTimestamp(userId, timestamp);

        moment.locale(ctx.user.language);

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
