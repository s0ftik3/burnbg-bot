'use strict';

const findFileById = require('../database/findFileById');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const file_id = ctx.match.input.replace('file_id::', '');

        const file = await findFileById(ctx.from.id, file_id);

        if (!file)
            return ctx.replyWithHTML(ctx.i18n.t('error.not_owner_of_image')).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });

        return ctx.replyWithPhoto(file_id).catch(() => {
            // if the source was a document
            return ctx.replyWithDocument(file_id).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
        });
    } catch (err) {
        console.error(err);
    }
};
