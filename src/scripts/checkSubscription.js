'use strict';

const User = require('../database/models/User');
const config = require('../../config');

module.exports = (ctx) => {
    try {
        return ctx.telegram.getChatMember(config.channel, ctx.from.id).then(response => {
            const is_member = (response.status === 'member' || response.status === 'owner') ? true : false;

            return is_member;
        }).catch(() => {});
    } catch (err) {
        console.error(err);
    }
};