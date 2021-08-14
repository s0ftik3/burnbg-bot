'use strict';

const User = require('../database/models/User');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config');
const getMedia = require('./getMedia');
const { removeBackgroundFromImageUrl } = require('remove.bg');

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
        
                const url = await axios({
                    method: 'POST',
                    url: config.host,
                    headers: { 
                        ...data.getHeaders(),
                        token: config.host_token
                    },
                    data: data
                })
                .then(response => response.data?.data?.bgRemoved)
                .catch(error => console.error(error));
        
                return url;
            });
 
            return data;
        } else {
            const data = new FormData();
    
            data.append('file', file.stream);
            data.append('mattingType', '6');
    
            const url = await axios({
                method: 'POST',
                url: config.host,
                headers: { 
                    ...data.getHeaders(),
                    token: config.host_token
                },
                data: data
            })
            .then(response => response.data?.data?.bgRemoved)
            .catch(error => console.error(error));
    
            return url;
        }
    } catch (err) {
        console.error(err);
    }
};