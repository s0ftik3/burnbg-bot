'use strict';

const Bot = require('../database/models/Bot');
const User = require('../database/models/User');
const getUserSession = require('../scripts/getUserSession');
const RemoveBackground = require('../scripts/removeBackground');
const convertToSticker = require('../scripts/convertToSticker');
const replyWithError = require('../scripts/replyWithError');
const checkSubscription = require('../scripts/checkSubscription');
const sendLog = require('../scripts/sendLog');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const is_member = await checkSubscription(ctx).then(response => response);
        if (user.usage > 20 && !is_member) return replyWithError(ctx, 11);

        const data = {
            ctx: ctx,
            language: user.language,
            bot_message_id: ctx.message.message_id + 1,
            message: (ctx.message.document) ?
                { 
                    type: 'document', 
                    mime: ctx.message.document.mime_type,
                    file_id: ctx.message?.document.file_id
                } 
                : { type: 'photo', file_id: ctx.update?.message?.photo.reverse()[0].file_id },
            text: ctx.message.caption && ctx.message.caption,
            service: user.service,
            output: (user.to_sticker) ? 'sticker' : 'file'
        };

        if (data.message?.mime !== undefined 
            && data.message?.mime !== 'image/jpeg' 
            && data.message?.mime !== 'image/png') return replyWithError(ctx, 2);

        ctx.replyWithHTML(ctx.i18n.t('service.standby')).catch(() => replyWithError(ctx, 15));

        const removeBackground = new RemoveBackground(data);
        const result = await removeBackground.main()
            .then(response => response)
            .catch(err => err);

        if (data.service === 0) {
            await Bot.updateOne({ id: 1 }, { 
                $set: {
                    active_token: ctx.session.bot.active_token,
                    inactive_tokens: ctx.session.bot.inactive_tokens,
                    number: ctx.session.bot.number
                }
            }, () => {});
        }
        
        if (result?.code === 3) return replyWithError(ctx, 3);
        if (result?.code === 4) return replyWithError(ctx, 4);
        if (result?.code === 5) return replyWithError(ctx, 5);
        if (result?.code === 6) return replyWithError(ctx, 6);
        if (result?.code === 7) return replyWithError(ctx, 7);
        if (result?.code === 8) return replyWithError(ctx, 8);
        if (result?.code === 10) return replyWithError(ctx, 10);
        if (result?.code === 12) return replyWithError(ctx, 12);

        if (data.output === 'file') {
            ctx.replyWithChatAction('upload_document');

            await ctx.deleteMessage(ctx.message.message_id + 1).catch(() => {});

            ctx.replyWithDocument({ 
                source: result.buffer, 
                filename: '@burnbgbot.png' 
            }, {
                reply_to_message_id: ctx.message.message_id
            }).catch(() => replyWithError(ctx, 13));;

            sendLog({
                type: 'common',
                id: ctx.from.id,
                username: user.username,
                name: user.first_name,
                query_type: data.message.type,
                action: 0, // 0 - no-bg image / 1 - sticker
                size: result.initial_file_size,
                usage: user.usage,
                to_sticker: user.converted_to_sticker,
                to_file: user.converted_to_file,
                subscription: user.channel_member ? true : false,
                timestamp: new Date()
            });
        } else {
            const sticker = await convertToSticker(result.buffer, data.text);

            await ctx.deleteMessage(ctx.message.message_id + 1).catch(() => {});
            
            ctx.replyWithSticker({ source: sticker }, {
                reply_to_message_id: ctx.message.message_id
            }).catch(() => replyWithError(ctx, 14));

            sendLog({
                type: 'common',
                id: ctx.from.id,
                username: user.username,
                name: user.first_name,
                query_type: data.message.type,
                action: 1, // 0 - no-bg image / 1 - sticker
                size: result.initial_file_size,
                usage: user.usage,
                to_sticker: user.converted_to_sticker,
                to_file: user.converted_to_file,
                subscription: user.channel_member ? true : false,
                timestamp: new Date()
            });
        }

        User.updateOne({ id: ctx.from.id }, { 
            $inc: { 
                usage: 1,
                converted_to_sticker: (user.to_sticker) ? 1 : 0,
                converted_to_file: (user.to_sticker) ? 0 : 1
            },
            $set: { last_time_used: new Date() }
        }, () => {});
        
        ctx.session.user.usage = user.usage + 1;
        ctx.session.user.converted_to_sticker = (user.to_sticker) ? user.converted_to_sticker + 1 : user.converted_to_sticker;
        ctx.session.user.converted_to_file = (user.to_sticker) ? user.converted_to_file : user.converted_to_file + 1;
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};