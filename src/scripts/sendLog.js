'use strict';

const config = require('../../config');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(config.token);
const byteSize = require('byte-size');
const moment = require('moment');

module.exports = (data) => {
    try {
        moment.locale('en');
        
        switch (data.type) {
            case 'common':
                telegram.sendMessage(
                    config.logs,
                    `🤖 #burnbgbot\n\n` +
                    `👤 <a href="tg://user?id=${data.id}">${data.name}</a> just converted a <b>${data.query_type}</b> <code>(${byteSize(data.size)})</code> to a ` +
                    `<b>${(data.action === 0) ? 'no-background file' : 'sticker'}</b>.\n\n` +
                    `ℹ️ <b>Information:</b>\n` +
<<<<<<< HEAD
                    `├ ID: <b>${data.id}</b>\n` +
=======
>>>>>>> d7149680e9ea65d22e25013dac019ac8e1328e3d
                    `├ Total converted: <b>${data.usage}</b>\n` +
                    `├ Converted to sticker: <b>${data.to_sticker}</b>\n` +
                    `├ Converted to file: <b>${data.to_file}</b>\n` +
                    `├ Subscribed: <b>${data.subscription}</b>\n\n` +
                    `🕓 <i>${moment(data.timestamp).format('LLL')}</i>`,
                    {
                        parse_mode: 'HTML'
                    }
                );

                break;
            case 'new_user':
                telegram.sendMessage(
                    config.logs,
                    `🤖 #burnbgbot\n\n` +
<<<<<<< HEAD
                    `👤 [${data.id}] New user <a href="tg://user?id=${data.id}">${data.name}</a> has just started the bot.\n\n` +
=======
                    `👤 New user <a href="tg://user?id=${data.id}">${data.name}</a> has just started the bot.\n\n` +
>>>>>>> d7149680e9ea65d22e25013dac019ac8e1328e3d
                    `🕓 <i>${moment(data.timestamp).format('LLL')}</i>`,
                    {
                        parse_mode: 'HTML'
                    }
                );

                break;
            case 'error_common':
                telegram.sendMessage(
                    config.logs,
                    `🤖 #burnbgbot\n\n` +
<<<<<<< HEAD
                    `⭕️ [${data.id}] An error occured with the user <a href="tg://user?id=${data.id}">${data.name}</a>.\n\n` +
=======
                    `⭕️ An error occured with the user <a href="tg://user?id=${data.id}">${data.name}</a>.\n\n` +
>>>>>>> d7149680e9ea65d22e25013dac019ac8e1328e3d
                    `🕓 <i>${moment(data.timestamp).format('LLL')}</i>`,
                    {
                        parse_mode: 'HTML'
                    }
                );

                break;
            case 'error_no_sub':
                telegram.sendMessage(
                    config.logs,
                    `🤖 #burnbgbot\n\n` +
<<<<<<< HEAD
                    `⭕️ [${data.id}] <a href="tg://user?id=${data.id}">${data.name}</a> tried to use the bot without subscription.\n\n` +
=======
                    `⭕️ <a href="tg://user?id=${data.id}">${data.name}</a> tried to use the bot without subscription.\n\n` +
>>>>>>> d7149680e9ea65d22e25013dac019ac8e1328e3d
                    `🕓 <i>${moment(data.timestamp).format('LLL')}</i>`,
                    {
                        parse_mode: 'HTML'
                    }
                );

                break;
            case 'service_change':
                telegram.sendMessage(
                    config.logs,
                    `🤖 #burnbgbot\n\n` +
<<<<<<< HEAD
                    `🔄 [${data.id}] <a href="tg://user?id=${data.id}">${data.name}</a> changed service from <b>${data.old_service + 1}</b> to <b>${data.service + 1}</b>.\n\n` +
=======
                    `🔄 <a href="tg://user?id=${data.id}">${data.name}</a> changed service from <b>${data.old_service + 1}</b> to <b>${data.service + 1}</b>.\n\n` +
>>>>>>> d7149680e9ea65d22e25013dac019ac8e1328e3d
                    `🕓 <i>${moment(data.timestamp).format('LLL')}</i>`,
                    {
                        parse_mode: 'HTML'
                    }
                );

                break;
            default:
                break;
        }
    } catch (err) {
        console.error(err);
    }
};