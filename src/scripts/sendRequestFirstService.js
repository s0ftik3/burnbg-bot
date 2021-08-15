'use strict';

const Bot = require('../database/models/Bot');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config');

module.exports = async (ctx, file, active_token) => {
    try {
        const data = new FormData();
        const i = Math.floor(Math.random() * 2);
    
        data.append('file', file.stream);
        data.append('mattingType', (i > 0) ? '5' : '6');

        const url = await axios({
            method: 'POST',
            url: config.host,
            headers: { 
                ...data.getHeaders(),
                token: active_token
            },
            data: data
        })
        .then(async response => {
            if (response.data.code === 4004) {
                if (active_token === config.host_token2) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token3  } }, () => {});
                    ctx.session.active_token = config.host_token3;
                } else if (ctx.session.token === config.host_token3) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token4  } }, () => {});
                    ctx.session.active_token = config.host_token4;
                } else if (ctx.session.token === config.host_token4) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token5  } }, () => {});
                    ctx.session.active_token = config.host_token5;
                } else if (ctx.session.token === config.host_token5) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token6  } }, () => {});
                    ctx.session.active_token = config.host_token6;
                } else if (ctx.session.token === config.host_token6) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token7  } }, () => {});
                    ctx.session.active_token = config.host_token7;
                } else if (ctx.session.token === config.host_token7) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token8  } }, () => {});
                    ctx.session.active_token = config.host_token8;
                } else if (ctx.session.token === config.host_token8) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token9  } }, () => {});
                    ctx.session.active_token = config.host_token9;
                } else if (ctx.session.token === config.host_token9) {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token  } }, () => {});
                    ctx.session.active_token = config.host_token;
                } else {
                    await Bot.updateOne({ id: 1 }, { $set: { active_token: config.host_token2  } }, () => {});
                    ctx.session.active_token = config.host_token2;
                }
                
                return 'SWITCH_TOKEN';
            } else {
                return response.data?.data?.bgRemoved
            }
        })
        .catch(error => console.error(error));

        return url;
    } catch (err) {
        console.error(err);
    }
};