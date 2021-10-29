const getUserSession = require('../../utils/general/getUserSession');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        if (user.role !== 'admin') return;

        const file_id = ctx.match.input.replace('file_id:', '');

        ctx.replyWithPhoto(file_id)
        .catch(() => ctx.reply('🙅‍♂️ Couldn\'t sent the picture.\n\n*The file_id has been changed by Telegram.\n*The file is too big.\n*Wrong file_id specified.*\nFile mime_type mismatch.'));
    } catch (err) {
        console.error(err);
    }
};