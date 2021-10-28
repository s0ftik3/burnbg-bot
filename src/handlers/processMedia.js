'use strict';

const Bot = require('../database/models/Bot');
const getUserSession = require('../scripts/getUserSession');
const RemoveBackground = require('../scripts/removeBackground');
const replyWithError = require('../scripts/replyWithError');
const checkSubscription = require('../scripts/checkSubscription');
const replyWithFile = require('../scripts/replyWithFile');
const replyWithSticker = require('../scripts/replyWithSticker');
const updateUser = require('../database/updateUser');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user?.language);

        const is_member = await checkSubscription(ctx).then(response => response);
        if (user.usage >= 5 && !is_member) return replyWithError(ctx, 11);

        const data = {
            ctx: ctx,
            language: user.language,
            bot_message_id: ctx.message.message_id + 1,
            message: (ctx.message.document) ?
                { 
                    type: 'document', 
                    mime: ctx.message?.document.mime_type,
                    file_id: ctx.message?.document.file_id,
                    file_name: ctx.message?.document.file_name
                }
                : { type: 'photo', file_id: ctx.update?.message?.photo.reverse()[0].file_id },
            text: ctx.message.caption && ctx.message.caption,
            service: user.service,
            output: (user.to_sticker) ? 'sticker' : 'file'
        };

        if (data.message?.mime !== undefined &&
            data.message?.mime !== 'image/jpeg' &&
            data.message?.mime !== 'image/png') return replyWithError(ctx, 2);

        ctx.replyWithHTML(ctx.getString(ctx, 'service.standby')).catch(() => replyWithError(ctx, 15));

        const removeBackground = new RemoveBackground(data);
        const result = await removeBackground.main()
            .then(response => response)
            .catch(err => err);

        if (data.service === 0) {
            await Bot.updateOne({ id: 1 }, { 
                $set: {
                    active_token: ctx.session.bot.active_token,
                    inactive_tokens: ctx.session.bot.inactive_tokens,
                    number: ctx.session.bot.number,
                    type: ctx.session.bot.type
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
        if (result?.code === 12) return replyWithError(ctx, 12, result.msg);
        if (result?.code === 17) return replyWithError(ctx, 17, result.service);
        if (result?.code === 18) return replyWithError(ctx, 18);

        switch (data.output) {
            case 'file':
                replyWithFile(ctx, data, user, result);
                break;
            case 'sticker':
                replyWithSticker(ctx, data, user, result);
                break;
            default:
                console.log('Unknown output: %s', data.output);
                replyWithError(ctx, 0);
                break;
        }

        updateUser(ctx, user, data);
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};