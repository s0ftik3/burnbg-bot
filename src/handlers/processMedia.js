'use strict';

const Bot = require('../database/models/Bot');
const User = require('../database/models/User');
const getUserSession = require('../scripts/getUserSession');
const RemoveBackground = require('../scripts/removeBackground');
const convertToSticker = require('../scripts/convertToSticker');
const replyWithError = require('../scripts/replyWithError');
const checkSubscription = require('../scripts/checkSubscription');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        // const is_member = await checkSubscription(ctx).then(response => response);

        // if (user.usage > 30 && !is_member) return replyWithError(ctx, 11);

        const data = {
            ctx: ctx,
            language: user.language,
            message: (ctx.message.document) ?
                { 
                    type: 'document', 
                    mime: ctx.message.document.mime_type,
                    file_id: ctx.message?.document.file_id
                } 
                : { type: 'photo', file_id: ctx.update?.message?.photo.reverse()[0].file_id },
            service: user.service,
            output: (user.to_sticker) ? 'sticker' : 'file'
        };

        if (data.message?.mime !== undefined 
            && data.message?.mime !== 'image/jpeg' 
            && data.message?.mime !== 'image/png') return replyWithError(ctx, 2);

        if (data.output === 'file') {
            ctx.replyWithChatAction('upload_document');
        } else {
            ctx.replyWithHTML(ctx.i18n.t('service.standby'));
        }

        const removeBackground = new RemoveBackground(data);
        const result = await removeBackground.main()
            .then(response => response)
            .catch(err => err);

        if (result?.code === 3) return replyWithError(ctx, 3);
        if (result?.code === 4) return replyWithError(ctx, 4);
        if (result?.code === 5) return replyWithError(ctx, 5);
        if (result?.code === 6) return replyWithError(ctx, 6);
        if (result?.code === 7) return replyWithError(ctx, 7);
        if (result?.code === 8) return replyWithError(ctx, 8);
        if (result?.code === 10) return replyWithError(ctx, 10);

        if (data.output === 'file') {
            ctx.replyWithDocument({ 
                source: result.buffer, 
                filename: '@burnbgbot.png' 
            }, {
                reply_to_message_id: ctx.message.message_id
            });

            console.log(`[${ctx.from.id}] Converted to a no-background image.`);
        } else {
            const sticker = await convertToSticker(result.buffer);

            await ctx.deleteMessage(ctx.message.message_id + 1).catch(() => {});

            ctx.replyWithSticker({ source: sticker }, {
                reply_to_message_id: ctx.message.message_id
            });

            console.log(`[${ctx.from.id}] Converted to a sticker.`);
        }

        User.updateOne({ id: ctx.from.id }, { 
            $inc: { 
                usage: 1,
                converted_to_sticker: (user.to_sticker) ? 1 : 0,
                converted_to_file: (user.to_sticker) ? 0 : 1
            },
            $set: { last_time_used: new Date() }
        }, () => {});
        
        Bot.updateOne({ id: 1 }, { 
            $set: {
                acitve_token: ctx.session.bot.acitve_token,
                inactive_tokens: ctx.session.bot.inactive_tokens,
                number: ctx.session.bot.number
            }
        }, () => {});
        
        ctx.session.user.usage = user.usage + 1;
        ctx.session.user.converted_to_sticker = user.converted_to_sticker + 1;
        ctx.session.user.converted_to_file = user.converted_to_file + 1;
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};