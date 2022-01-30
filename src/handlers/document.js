'use strict';

const RemoveBackground = require('../scripts/removeBackground');
const replyWithError = require('../scripts/replyWithError');
const checkSubscription = require('../scripts/checkSubscription');
const updateTokens = require('../database/updateTokens');
const replyWithFile = require('../scripts/replyWithFile');
const replyWithSticker = require('../scripts/replyWithSticker');

module.exports = () => async (ctx) => {
    try {
        const isSubscriber = await checkSubscription(ctx);
        if (ctx.user.usage >= 5 && !isSubscriber) return replyWithError(ctx, 'NOT_SUBSCRIBED');

        const data = {
            user: ctx.user,
            userId: ctx.from.id,
            session: ctx.session,
            editMessageText: async (userId, message_id, text) =>
                ctx.telegram.editMessageText(userId, message_id, null, text, { parse_mode: 'HTML' }),
            i18n: ctx.i18n,
            language: ctx.user.language,
            message: {
                type: 'document',
                mime: ctx.message.document.mime_type,
                file_id: ctx.message.document.file_id,
                file_name: ctx.message.document.file_name.split('.')[0],
            },
            service: ctx.user.service,
            output: ctx.user.to_sticker ? 'sticker' : 'file',
        };

        if (
            data.message?.mime !== undefined &&
            data.message?.mime !== 'image/jpeg' &&
            data.message?.mime !== 'image/png'
        )
            return replyWithError(ctx, 'WRONG_FILE_EXTENSION');

        await ctx
            .replyWithHTML(ctx.i18n.t('service.standby'))
            .then((response) => {
                Object.assign(data, { standby_message_id: response.message_id });
            })
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });

        const removeBackground = new RemoveBackground(data);
        const result = await removeBackground
            .remove()
            .then((response) => response)
            .catch((err) => {
                console.error(err.message);
            });

        if (data.service === 0) {
            await updateTokens(ctx.session.bot);
        }

        if (result?.code === 'PROCESSING_ERROR') return replyWithError(ctx, result.code);
        if (result?.code === 'UNKNOWN_SERVICE') return replyWithError(ctx, result.code);
        if (result?.code === 'TOO_BIG_FILE') return replyWithError(ctx, result.code);
        if (result?.code === 'FAILED_TO_DOWNLOAD') return replyWithError(ctx, result.code);
        if (result?.code === 'CHANGED_SERVICE') return replyWithError(ctx, result.code);
        if (result?.code === 'NO_ACTIVE_TOKENS') return replyWithError(ctx, result.code);
        if (result?.code === 'CHANGED_TOKEN') return replyWithError(ctx, result.code);
        if (result?.code === 'API_ERROR') return replyWithError(ctx, result.code);

        if (data.output === 'file') {
            await replyWithFile(ctx, { ...result, ...data }).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
        } else {
            await replyWithSticker(ctx, { ...result, ...data }).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
        }

        ctx.user.usage += 1;
        ctx.user.converted_to_sticker += ctx.user.to_sticker ? 1 : 0;
        ctx.user.converted_to_file += ctx.user.to_sticker ? 0 : 1;
        ctx.user.last_time_used = new Date();
        ctx.user.files.push({ file_id: data.message.file_id, output: data.output, timestamp: new Date() });

        await ctx.user.save();
    } catch (err) {
        console.error(err);
    }
};
