'use strict';

const moment = require('moment');
const plural = require('plural-ru');
const replyWithError = require('./replyWithError');

module.exports = (ctx, user) => {
    try {
        const language = user.language;
        moment.locale(language);
        
        switch (language) {
            case 'en':
                const obj_en = {
                    range: moment(user.timestamp).from(new Date(), true),
                    converted_to_sticker: user.converted_to_sticker === undefined ? 0 : user.converted_to_sticker,
                    converted_to_file: user.converted_to_file === undefined ? 0 : user.converted_to_file,
                    verb_sticker: (user.converted_to_sticker > 1) ? 'were' : 'was',
                    verb_file: (user.converted_to_file > 1) ? 'were' : 'was',
                    plural: (user.usage > 1) ? 's' : '',
                    usage: user.usage === undefined ? 0 : user.usage
                };

                return obj_en;
            case 'ru':
                const usage = user.usage === undefined ? 0 : user.usage;
                const converted_to_sticker = user.converted_to_sticker === undefined ? 0 : user.converted_to_sticker;
                const converted_to_file = user.converted_to_file === undefined ? 0 : user.converted_to_file;
                const images = `${usage} ${plural(usage, 'фотографию', 'фотографии', 'фотографий')}`; // 1 / 23 / 11 / 1.5
                const files = `${converted_to_file} ${plural(converted_to_file, 'была конвертирована', 'было конвертировано', 'было конвертировано')}`;
                const stickers = `${converted_to_sticker} ${plural(converted_to_sticker, 'была конвертирована', 'было конвертировано', 'было конвертировано')}`;
                const obj_ru = {
                    range: moment(user.timestamp).from(new Date(), true),
                    images: images,
                    files: files,
                    stickers: stickers
                };
                return obj_ru;
            case 'it':
                const obj_it = {
                    range: moment(user.timestamp).from(new Date(), true),
                    converted_to_sticker: user.converted_to_sticker === undefined ? 0 : user.converted_to_sticker,
                    converted_to_file: user.converted_to_file === undefined ? 0 : user.converted_to_file,
                    plural: (user.usage > 1) ? 's' : '',
                    usage: user.usage === undefined ? 0 : user.usage
                };

                return obj_it;
            case 'es':
                const obj_es = {
                    range: moment(user.timestamp).from(new Date(), true),
                    converted_to_sticker: user.converted_to_sticker === undefined ? 0 : user.converted_to_sticker,
                    converted_to_file: user.converted_to_file === undefined ? 0 : user.converted_to_file,
                    plural: (user.usage > 1) ? 'nes' : '',
                    usage: user.usage === undefined ? 0 : user.usage
                };

                return obj_es;
            default:
                replyWithError(ctx, 0);
                break;
        }
    } catch (err) {
        console.error(err);
    }
};