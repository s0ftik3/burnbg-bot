'use strict';

const Markup = require('telegraf/markup');
const replyWithError = require('../scripts/replyWithError');
const deleteUser = require('../database/deleteUser');

module.exports = () => async (ctx) => {
    try {
        if (ctx.updateType === 'message') {
            return ctx
                .replyWithHTML(ctx.i18n.t('service.pre_reset'), {
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(ctx.i18n.t('action.a_yes'), 'yes'),
                            Markup.callbackButton(ctx.i18n.t('action.a_no'), 'no'),
                        ],
                    ]),
                    disable_web_page_preview: true,
                })
                .catch((err) => {
                    console.error(err);
                    return replyWithError(ctx, 'METHOD_FAILED');
                });
        } else {
            await ctx.answerCbQuery();

            const action = ctx.match;

            if (action === 'yes') {
                const isDeleted = await deleteUser(ctx.from.id);

                if (!isDeleted.ok) {
                    return replyWithError(ctx, 'NO_USER_TO_DELETE');
                } else {
                    await ctx.deleteMessage();

                    return ctx
                        .replyWithHTML(ctx.i18n.t('service.reset'), {
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_markup: { remove_keyboard: true },
                        })
                        .catch((err) => {
                            console.error(err);
                            return replyWithError(ctx, 'METHOD_FAILED');
                        });
                }
            } else {
                return ctx.deleteMessage().catch((err) => {
                    console.error(err);
                    return replyWithError(ctx, 'METHOD_FAILED');
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};
