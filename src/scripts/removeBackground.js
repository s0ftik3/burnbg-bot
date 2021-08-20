'use strict';

const Bot = require('../database/models/Bot');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config');

module.exports = class RemoveBackground {
    constructor(data) {
        this.ctx = data.ctx;
        this.language = data.language;
        this.bot_message_id = data.bot_message_id;
        this.message = data.message;
        this.service = data.service;
        this.output = data.output;
    }

    /**
     * Removes background from given image.
     * @returns Promise, an object with either data or error and its code.
     */
    async main() {
        if (this.service === 0) {
            return new Promise((resolve, reject) => {
                Promise.all([this.getMedia(), this.getRequestData()]).then(async response => {
                    const image = response[0];
                    
                    const result = await this.callMainService(image).catch(err => err);
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            });
        } else {
            return new Promise(async (resolve, reject) => {
                const image = await this.getMedia();

                const result = await this.callSecondService(image).catch(err => err);
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }
    }

    /**
     * Downloads a picture the user sent.
     * @returns Promise, an object with either data or error and its code.
     * This function might return 4 - too big file, 6 - failed to download.
     */
    getMedia() {
        return new Promise((resolve, reject) => {
            const file_id = this.message.file_id;
            const download_url = `https://api.telegram.org/bot${config.token}/getFile?file_id=${file_id}`;
    
            axios(download_url).then(async response => {
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
                    
                    await this.ctx.telegram.editMessageText(
                        this.ctx.from.id, 
                        this.bot_message_id, 
                        0, 
                        this.ctx.i18n.t('service.image_downloaded', { 
                            size: Math.round((file.file_size / 1000000 + Number.EPSILON) * 100) / 100 
                        }),
                        { parse_mode: 'HTML' }
                    ).catch(() => {});

                    resolve({
                        code: 200,
                        stream: image_stream,
                        url: url,
                        size: file.file_size,
                        name: file.file_path.replace(/(documents\/|photos\/)/g, '')
                    });
                }
            }).catch(() => {
                reject({ code: 6, error: 'Failed to download' });
            });
        });
    }
    
    /**
     * Requests data from database to make an API call.
     * @returns Promise, an object with either data or error and its code.
     * This function might return 7 - failed to get data from database.
     */
    getRequestData() {
        return new Promise((resolve, reject) => {
            Bot.find({ id: 1 }).then(response => {
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
    callMainService(image) {
        return new Promise((resolve, reject) => {
            const hosts = {
                1: config.host_token,
                2: config.host_token2,
                3: config.host_token3,
                4: config.host_token4,
                5: config.host_token5,
                6: config.host_token6,
                7: config.host_token7,
                8: config.host_token8,
                9: config.host_token9,
                10: config.host_token10
            };
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
                        this.ctx.session.bot?.inactive_tokens.push(this.ctx.session.bot.active_token);
    
                        if (this.ctx.session.bot?.number === 10) {
                            this.ctx.session.bot.active_token = config.host_token;
                            this.ctx.session.bot.number = 1;
                        } else {
                            this.ctx.session.bot.active_token = hosts[this.ctx.session.bot.number + 1];
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
                reject({ code: 8, error: 'Failed to call API', msg: err });
            });
        });
    }

    /**
     * Calls the second service's API and converts the result to buffer.
     * @param {Object} image Image data
     * @returns Promise, an object with either data or error and its code.
     * This function might return 12 - failed to call 2nd API.
     */
    callSecondService(image) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            
            data.append('file', image.stream);

            axios({
                method: 'POST',
                url: config.host2,
                headers: {
                    ...data.getHeaders(),
                },
                data: data,
                responseType: 'arraybuffer'
            }).then(response => {
                resolve({
                    buffer: Buffer.from(response.data, 'binary'),
                    initial_file_size: image.size
                });
            }).catch((err) => {
                reject({ code: 12, error: 'Failed to call 2nd API', msg: err });
            });
        });
    }
}; 