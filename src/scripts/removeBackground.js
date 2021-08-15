'use strict';

const Bot = require('../database/models/Bot');
const User = require('../database/models/User');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config');
const getMedia = require('./getMedia');
const { removeBackgroundFromImageUrl } = require('remove.bg');
const sendRequestFirstService = require('./sendRequestFirstService');

module.exports = async (ctx) => {
    try {
        const file = await getMedia(ctx);

        if (!file) return null;
        
        const url = file.url;

        if (ctx.session.user.service === 1) {
            const data = await removeBackgroundFromImageUrl({
                url,
                apiKey: config.host2_token,
                size: 'auto',
                type: 'auto'
            }).then(response => {
                return response.base64img;
            }).catch(async () => {
                User.updateOne({ id: ctx.from.id }, { $set: { service: 0 } }, () => {});
                ctx.session.user.service = 0;

                const data = new FormData();
    
                data.append('file', file.stream);
                data.append('mattingType', '6');
        
                let active_token;

                if (ctx.session.active_token === undefined) {
                    active_token = await Bot.find({ id: 1 }).then(response => response[0].active_token);
                } else {
                    active_token = ctx.session.active_token;
                }

                const url = await axios({
                    method: 'POST',
                    url: config.host,
                    headers: { 
                        ...data.getHeaders(),
                        token: active_token
                    },
                    data: data
                })
                .then(response => response.data?.data?.bgRemoved)
                .catch(error => console.error(error));
        
                return url;
            });
 
            return data;
        } else {
            let active_token;

            if (ctx.session.active_token === undefined) {
                active_token = await Bot.find({ id: 1 }).then(response => response[0].active_token);
            } else {
                active_token = ctx.session.active_token;
            }

            const result = await sendRequestFirstService(ctx, file, active_token).then(response => response);
            return result;
        }
    } catch (err) {
        console.error(err);
    }
};