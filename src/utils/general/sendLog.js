'use strict';

const config = require('../../config');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(config.token);
const byteSize = require('byte-size');
const moment = require('moment');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = (data) => {
    try {
        moment.locale('en');

        switch (data.type) {
            case 'common':
                telegram.sendMessage(
                    config.logs,
                    i18n.t('en', 'log.common', {
                        type: data.query_type === 'photo' ? '🖼' : '📄',
                        id: data.id,
                        name: data.name,
                        input: data.query_type,
                        output: data.action === 0 ? 'no-background file' : 'sticker',
                        size: byteSize(data.size),
                        total: data.usage,
                        to_sticker: data.to_sticker,
                        to_file: data.to_file,
                        subscription: data.subscription ? 'yes' : 'no',
                        language: i18n.t(data.language, 'language'),
                        registered: moment(data.registered).format('ll'),
                        timestamp: moment(data.timestamp).format('ll s'),
                        service: data.service
                    }),
                    {
                        parse_mode: 'HTML',
                        reply_markup: { 
                            inline_keyboard: [
                                [{ text: 'View', url: `https://t.me/share/url?url=file_id%3A${data.file_id}` }]
                            ]
                        }
                    }
                ).catch(() => {});

                break;
            case 'new_user':
                telegram.sendMessage(
                    config.logs,
                    i18n.t('en', 'log.new_user', {
                        id: data.id,
                        name: data.name,
                        timestamp: moment(data.timestamp).format('ll s')
                    }),
                    {
                        parse_mode: 'HTML'
                    }
                ).catch(() => {});

                break;
            case 'error_no_sub':
                telegram.sendMessage(
                    config.logs,
                    i18n.t('en', 'log.no_subscription', {
                        id: data.id,
                        name: data.name,
                        timestamp: moment(data.timestamp).format('ll s')
                    }),
                    {
                        parse_mode: 'HTML'
                    }
                ).catch(() => {});

                break;
            case 'service_change':
                telegram.sendMessage(
                    config.logs,
                    i18n.t('en', 'log.service_change', {
                        id: data.id,
                        name: data.name,
                        old_service: data.old_service + 1,
                        new_service: data.service + 1,
                        timestamp: moment(data.timestamp).format('ll s')
                    }),
                    {
                        parse_mode: 'HTML'
                    }
                ).catch(() => {});

                break;
            case 'language_change':
                telegram.sendMessage(
                    config.logs,
                    i18n.t('en', 'log.language_change', {
                        id: data.id,
                        name: data.name,
                        old_language: data.old_language,
                        new_language: data.new_language,
                        timestamp: moment(data.timestamp).format('ll s')
                    }),
                    {
                        parse_mode: 'HTML'
                    }
                ).catch(() => {});

                break;
            case 'to_sticker':
                telegram.sendMessage(
                    config.logs,
                    i18n.t('en', 'log.to_sticker', {
                        id: data.id,
                        name: data.name,
                        action: data.action ? 'on' : 'off',
                        timestamp: moment(data.timestamp).format('ll s')
                    }),
                    {
                        parse_mode: 'HTML'
                    }
                ).catch(() => {});

                break;
            case 'reseted':
                telegram.sendMessage(
                    config.logs,
                    i18n.t('en', 'log.reseted', {
                        id: data.id,
                        name: data.name,
                        timestamp: moment(data.timestamp).format('ll s')
                    }),
                    {
                        parse_mode: 'HTML'
                    }
                ).catch(() => {});

                break;
            default:
                break;
        }
    } catch (err) {
        console.error(err);
    }
};