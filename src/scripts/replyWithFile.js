'use strict';

const sendLog = require('../scripts/sendLog');
const replyWithError = require('./replyWithError');

module.exports = async (ctx, data, user, result) => {
    try {
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
            name: ctx.from.first_name,
            query_type: data.message.type,
            action: 0, // 0 - no-bg image / 1 - sticker
            size: result.initial_file_size,
            usage: user.usage,
            to_sticker: user.converted_to_sticker,
            to_file: user.converted_to_file,
            language: user.language,
            registered: user.timestamp,
            timestamp: new Date()
        });
    } catch (err) {
        console.error(err);
    }
};