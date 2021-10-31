'use strict';

const User = require('../database/models/User');
const getUserSession = require('../utils/general/getUserSession');
const Markup = require('telegraf/markup');
const sendLog = require('../utils/general/sendLog');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const action = ctx.match;

        if (action === 'service') {
            ctx.editMessageText(ctx.getString(ctx, 'service.change_service', {
                service_1: (user.service === 0) ? '✅ <b>cutout.pro</b>' : 'cutout.pro',
                service_2: (user.service === 1) ? '✅ <b>benzin.io</b>' : 'benzin.io',
                service_3: (user.service === 2) ? '✅ <b>experte.de</b>' : 'experte.de',
                service_4: (user.service === 3) ? '✅ <b>erase.bg</b>' : 'erase.bg'
            }), {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton((user.service === 0) ? '· Cutout ·' : 'Cutout', 'change_service:0'),
                        Markup.callbackButton((user.service === 1) ? '· Benzin ·' : 'Benzin', 'change_service:1')
                    ],
                    [
                        Markup.callbackButton((user.service === 2) ? '· Experte ·' : 'Experte', 'change_service:2'),
                        Markup.callbackButton((user.service === 3) ? '· Erase ·' : 'Erase', 'change_service:3')
                    ],
                    [Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')]
                ])
            });

            ctx.answerCbQuery();
        } else {
            const old_service = user.service;
            const new_service = ctx.match[1];

            if (new_service === old_service) return ctx.answerCbQuery(ctx.i18n.t('error.the_same_service'));

            await User.updateOne({ id: ctx.from.id }, { $set: { service: new_service } }, () => {});
            ctx.session.user.service = new_service;

            ctx.editMessageText(ctx.getString(ctx, 'service.change_service', {
                service_1: (ctx.session.user.service === 0) ? '✅ <b>cutout.pro</b>' : 'cutout.pro',
                service_2: (ctx.session.user.service === 1) ? '✅ <b>benzin.io</b>' : 'benzin.io',
                service_3: (ctx.session.user.service === 2) ? '✅ <b>experte.de</b>' : 'experte.de',
                service_4: (ctx.session.user.service === 3) ? '✅ <b>erase.bg</b>' : 'erase.bg'
            }), {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton((ctx.session.user.service === 0) ? '· Cutout ·' : 'Cutout', 'change_service:0'),
                        Markup.callbackButton((ctx.session.user.service === 1) ? '· Benzin ·' : 'Benzin', 'change_service:1')
                    ],
                    [
                        Markup.callbackButton((ctx.session.user.service === 2) ? '· Experte ·' : 'Experte', 'change_service:2'),
                        Markup.callbackButton((ctx.session.user.service === 3) ? '· Erase ·' : 'Erase', 'change_service:3')
                    ],
                    [Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')]
                ])
            });

            if (ctx.session.user.service === 0) {
                sendLog({ 
                    type: 'service_change', 
                    id: ctx.from.id, 
                    name: ctx.from.first_name, 
                    service: ctx.session.user.service,
                    old_service: old_service
                });
            } else if (ctx.session.user.service === 1) {
                sendLog({ 
                    type: 'service_change', 
                    id: ctx.from.id, 
                    name: ctx.from.first_name, 
                    service: ctx.session.user.service,
                    old_service: old_service
                });
            } else if (ctx.session.user.service === 2) {
                sendLog({ 
                    type: 'service_change', 
                    id: ctx.from.id, 
                    name: ctx.from.first_name, 
                    service: ctx.session.user.service,
                    old_service: old_service
                });
            } else if (ctx.session.user.service === 3) {
                sendLog({ 
                    type: 'service_change', 
                    id: ctx.from.id, 
                    name: ctx.from.first_name, 
                    service: ctx.session.user.service,
                    old_service: old_service
                });
            }
            
            ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};