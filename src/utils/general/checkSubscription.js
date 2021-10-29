'use strict';

const User = require('../../database/models/User');
const config = require('../../config');

module.exports = (ctx) => {
    try {
        return ctx.telegram.getChatMember(config.channel, ctx.from.id).then(response => {
            const roles = ['member', 'creator', 'administrator'];
            const is_member = roles.includes(response.status) ? true : false;
            
            User.updateOne({ id: ctx.from.id }, { $set: { channel_member: is_member } }, () => {});

            return is_member;
        }).catch(() => {});
    } catch (err) {
        console.error(err);
    }
};