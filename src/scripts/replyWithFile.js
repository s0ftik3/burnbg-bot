'use strict';

const sendLog = require('../scripts/sendLog');
const replyWithError = require('./replyWithError');

module.exports = async (ctx, data, user, result) => {
    try {
        ctx.replyWithChatAction('upload_document');

        await ctx.deleteMessage(ctx.message.message_id + 1).catch(() => {});

        ctx.replyWithDocument({ 
            source: result.buffer, 
            filename: data.message?.file_name ? `${data.message.file_name}.png` : '@burnbgbot.png'
        }, {
            reply_to_message_id: ctx.message.message_id
        }).catch(() => replyWithError(ctx, 13));

        const services = {
            0: 'the 1st',
            1: 'the 2nd',
            2: 'the 3rd'
        };

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
            timestamp: new Date(),
            file_id: data.message.file_id,
            service: services[data.service]
        });
    } catch (err) {
        console.error(err);
    }
};