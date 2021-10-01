const User = require('../../database/models/User');
const config = require('../../../config');
const moment = require('moment');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        ctx.reply(ctx.i18n.t('log.standby')).then(response => {
            ctx.session.adm_msg_id = response.message_id;
        });

        const users = await User.find();
        const total = users.length;
        const channel_members = users.filter(e => e.channel_member === true).length;
        const ru = users.filter(e => e.language === 'ru').length;
        const en = users.filter(e => e.language === 'en').length;
        const es = users.filter(e => e.language === 'es').length;
        const it = users.filter(e => e.language === 'it').length;
        const ml = users.filter(e => e.language === 'ml').length;
        const pt_br = users.filter(e => e.language === 'pt-br').length;
        const te = users.filter(e => e.language === 'te').length;
        const to_sticker = users.filter(e => e.to_sticker === true).length;
        const used_today = users.filter(e => new Date(e.last_time_used).getDate() === new Date().getDate()).length;

        let to_file_the_most = { converted_to_file: 0 };
        let to_sticker_the_most = { converted_to_sticker: 0 };
        let usage_the_most = { usage: 0 };
        let last_time_used = { last_time_used: 0 };

        for (let i = 0; i < users.length; i++) {
            if (users[i].converted_to_file > to_file_the_most.converted_to_file) {
                to_file_the_most = users[i];
            }
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].converted_to_sticker > to_sticker_the_most.converted_to_sticker) {
                to_sticker_the_most = users[i];
            }
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].usage > usage_the_most.usage) {
                usage_the_most = users[i];
            }
        }

        
        for (let i = 0; i < users.length; i++) {
            if (users[i].last_time_used > last_time_used.last_time_used) {
                last_time_used = users[i];
            }
        }

        await ctx.replyWithHTML(ctx.i18n.t('log.stats', {
            total: total,
            channel_members: channel_members,
            en: en,
            ru: ru,
            es: es,
            it: it,
            ml: ml,
            pt_br: pt_br,
            te: te,
            to_sticker: to_sticker,
            file_id: to_file_the_most.id,
            file_name: to_file_the_most.first_name,
            file_converted: to_file_the_most.converted_to_file,
            sticker_id: to_sticker_the_most.id,
            sticker_name: to_sticker_the_most.first_name,
            sticker_converted: to_sticker_the_most.converted_to_sticker,
            usage_id: usage_the_most.id,
            usage_name: usage_the_most.first_name,
            usage_usage: usage_the_most.usage,
            used_today: used_today,
            last_time_id: last_time_used.id,
            last_time_name: last_time_used.first_name,
            last_time_timestamp: moment(last_time_used.last_time_used).fromNow()
        }))

        await ctx.deleteMessage(ctx.session.adm_msg_id);

        ctx.session.adm_msg_id = undefined;
    } catch (err) {
        console.error(err);
    }
};