'use strict';

const axios = require('axios');
const config = require('../../config');

module.exports = async (ctx) => {
    try {
        const message_type = (ctx.message.document) ? 'document' : 'photo';
        const file_id = (message_type === 'document') ? ctx.message.document.file_id : ctx.update.message.photo.reverse()[0].file_id;
        const destination = `https://api.telegram.org/bot${config.token}/getFile?file_id=${file_id}`;

        const file = await axios(destination).then((response) => response.data.result);
        const url = `https://api.telegram.org/file/bot${config.token}/${file.file_path}`;

        if (file.file_size >= 20971520) return;

        const image_data = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        }).then((response) => response.data);

        return {
            stream: image_data,
            url: url
        };
    } catch (err) {
        console.error(err);
    }
};