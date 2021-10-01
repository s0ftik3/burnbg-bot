const getUserSession = require('../../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        if (user.role !== 'admin') return;

        const file_id = ctx.match.input.replace('file_id:', '');

        ctx.replyWithPhoto(file_id);
    } catch (err) {
        console.error(err);
    }
};