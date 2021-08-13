'use strict';

const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config');
const getMedia = require('./getMedia');

module.exports = async (ctx) => {
    try {
        const data = new FormData();
        const file = await getMedia(ctx);

        if (!file) return null;

        data.append('file', file);
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
    } catch (err) {
        console.error(err);
    }
};