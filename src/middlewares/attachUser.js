'use strict';

const findOrCreateUser = require('../database/findOrCreateUser');
const setLanguage = require('../scripts/setLanguage');

module.exports = () => {
    return async (ctx, next) => {
        try {
            const data = {
                id: ctx.from.id,
                first_name: ctx.from.first_name.replace(/[<>]/g, ''),
                last_name: ctx.from.last_name === undefined ? null : ctx.from.last_name,
                username: ctx.from.username === undefined ? null : ctx.from.username,
                language: setLanguage(ctx.from.language_code)
            };
            
            const user = await findOrCreateUser(data);
            ctx.user = user;
            ctx.i18n.locale(ctx.user.language);
            
            return next();
        } catch (err) {
            console.error(err)
        }
    }
}