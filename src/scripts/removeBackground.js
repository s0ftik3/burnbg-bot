'use strict';

const Bot = require('../database/models/Bot');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config');

module.exports = class RemoveBackground {
    constructor(data) {
        this.ctx = data.ctx;
        this.language = data.language;
        this.message = data.message;
        this.service = data.service;
        this.output = data.output;
    }

    /**
     * Removes background from given image.
     * @returns Promise, an object with either data or error and its code.
     */
    async main() {
        return new Promise((resolve, reject) => {
            Promise.all([this.getMedia(), this.getRequestData()]).then(async response => {
                const image = response[0];
                
                const result = await this.callMainService(image);
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Downloads a picture the user sent.
     * @returns Promise, an object with either data or error and its code.
     * This function might return 4 - too big file, 6 - failed to download.
     */
    async getMedia() {
        return new Promise(async (resolve, reject) => {
            const file_id = this.message.file_id;
            const download_url = `https://api.telegram.org/bot${config.token}/getFile?file_id=${file_id}`;
    
            await axios(download_url).then(async response => {
                const file = response.data.result;
                const url = `https://api.telegram.org/file/bot${config.token}/${file.file_path}`;

                if (file.file_size >= 20971520) {
                    reject({ code: 4, error: 'Too big file' });
                    return;
                } else {
                    const image_stream = await axios({
                        method: 'GET',
                        url: url,
                        responseType: 'stream'
                    }).then(response => response.data);
                    
                    resolve({
                        code: 200,
                        stream: image_stream,
                        url: url,
                        size: file.file_size
                    });
                }
            }).catch(() => {
                reject({ code: 6, error: 'Failed to download' });
                return;
            });
        });
    }
    
    /**
     * Requests data from database to make an API call.
     * @returns Promise, an object with either data or error and its code.
     * This function might return 7 - failed to get data from database.
     */
    async getRequestData() {
        return new Promise(async (resolve, reject) => {
            await Bot.find({ id: 1 }).then(response => {
                this.ctx.session.bot = response[0];
                resolve(response[0]);
            }).catch(() => {
                reject({ code: 7, error: 'Failed to get request data from database' });
            });
        });
    }

    /**
     * Calls the main service's API and converts the result to buffer.
     * @param {Object} image Image data 
     * @returns Promise, an object with either data or error and its code.
     * This function might return 3 - no active tokens, 7 - failed to call API.
     */
    async callMainService(image) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            
            data.append('file', image.stream);
            data.append('mattingType', '5');
            
            axios({
                method: 'POST',
                url: config.host,
                headers: { 
                    ...data.getHeaders(),
                    token: this.ctx.session.bot.active_token
                },
                data: data
            }).then(response => {
                if (response.data.code === 4004) {
                    if (this.ctx.session.bot?.inactive_tokens.length >= 10) {
                        reject({ code: 3, error: 'No active tokens left' });
                        return;
                    } else {
                        // this.ctx.replyWithHTML(this.ctx.i18n.t('service.still_working'));
    
                        this.ctx.session.bot?.inactive_tokens.push(this.ctx.session.bot.active_token);
    
                        if (this.ctx.session.bot?.number === 10) {
                            this.ctx.session.bot.active_token = config.host_token;
                            this.ctx.session.bot.number = 1;
                        } else {
                            this.ctx.session.bot.active_token = eval('config.host_token' + (this.ctx.session.bot?.number + 1));
                            ++this.ctx.session.bot.number;
                        }

                        reject({ code: 5, error: 'Switched token' });
                        return;
                    }
                } else {
                    axios.get(response.data?.data?.bgRemoved, {
                        responseType: 'arraybuffer'
                    }).then(response => {
                        resolve({
                            buffer: Buffer.from(response.data, 'binary'),
                            initial_file_size: image.size
                        });
                    }).catch(() => {
                        reject({ code: 10, error: 'Failed to download processed photo' });
                    });
                }
            }).catch((err) => {
                console.error(err);
                reject({ code: 8, error: 'Failed to call API' });
            });
        });
    }
}; 