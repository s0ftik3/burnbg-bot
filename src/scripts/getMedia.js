'use strict';

const axios = require('axios');
const config = require('../../config');

module.exports = async (ctx) => {
    try {
        const message_type = (ctx.message.document) ? 'document' : 'photo';
        const file_id = (message_type === 'document') ? ctx.message.document.file_id : ctx.update.message.photo.reverse()[0].file_id;
        const destination = `https://api.telegram.org/bot${config.token}/getFile?file_id=${file_id}`;

        const file = await axios(destination).then((response) => {
            if (response.data.result.file_size > 20971520) return null;
            return response.data.result.file_path
        });

        const image_data = await axios({
            method: 'GET',
            url: `https://api.telegram.org/file/bot${config.token}/${file}`,
            responseType: 'stream',
        }).then((response) => response.data);

        return image_data;
    } catch (err) {
        console.error(err);
    }
};