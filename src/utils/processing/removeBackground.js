'use strict';

const Bot = require('../../database/models/Bot');
const axios = require('axios');
const byteSize = require('byte-size');
const FormData = require('form-data');
const resetTokens = require('../database/resetTokens');
const config = require('../../config');
const changeService = require('../database/changeService');

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
    main() {
        return new Promise(async (resolve, reject) => {
            const image = await this.getMedia();

            switch (this.service) {
                case 0:
                    this.getRequestData().then(() => {
                        this.processImage(image, 0)
                            .then(response => resolve(response))
                            .catch(err => reject({ code: 21, error: 'Main function failure', msg: err }));
                    });
                    break;
                case 1:
                    this.processImage(image, 1)
                        .then(response => resolve(response))
                        .catch(err => reject({ code: 21, error: 'Main function failure', msg: err }));
                    break;
                case 2:
                    this.processImage(image, 2)
                        .then(response => resolve(response))
                        .catch(err => reject({ code: 21, error: 'Main function failure', msg: err }));
                    break;
                case 3:
                    this.processImage(image, 3)
                        .then(response => resolve(response))
                        .catch(err => reject({ code: 21, error: 'Main function failure', msg: err }));
                    break;
            }
        });
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
                            type: this.message.type === 'photo' ? '🖼' : '📄',
                            size: byteSize(file.file_size)
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
     * Requests data from database to make an API call to the first service.
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
     * Processes query image via one of the services.
     * @param {Object} image Image data 
     * @param {Number} service 0 - cutout.pro; 1 - benzin.io; 2 - experte.de; 3 - erase.bg
     * @returns Promise, an object with either data or error and its code.
     * This function might return 20 - failed to process image.
     */
    processImage(image, service) {
        return new Promise((resolve, reject) => {
            switch (service) {
                case 0:
                    this.callFirstService(image)
                        .then(response => resolve(response))
                        .catch(err => reject({ code: 19, error: 'Failed to process image', msg: err }));
                    break;
                case 1:
                    this.callSecondService(image)
                        .then(response => resolve(response))
                        .catch(err => reject({ code: 19, error: 'Failed to process image', msg: err }));
                    break;
                case 2:
                    this.callThirdService(image)
                        .then(response => resolve(response))
                        .catch(err => reject({ code: 19, error: 'Failed to process image', msg: err }));
                    break;
                case 3:
                    this.callFourthService(image)
                        .then(response => resolve(response))
                        .catch(err => reject({ code: 19, error: 'Failed to process image', msg: err }));
                    break;
                default:
                    reject({ code: 20, error: `Unknown service. Expected 0, 1, 2 or 3. Received ${service}` });
                    break;
            }
        });
    }

    /**
     * Calls the first service's API and converts the result to buffer.
     * @param {Object} image Image data 
     * @returns Promise, an object with either data or error and its code.
     * This function might return 3 - no active tokens, 7 - failed to call API.
     */
    callFirstService(image) {
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
            data.append('mattingType', this.ctx.session.bot.type || '5');
            
            axios({
                method: 'POST',
                url: config.host,
                headers: {
                    ...data.getHeaders(),
                    token: this.ctx.session.bot.active_token
                },
                data: data
            }).then(async response => {
                const codes = [4000, 4001, 4002, 4003, 4004];

                if (codes.includes(response.data.code)) {
                    if (this.ctx.session.bot?.inactive_tokens.length >= 10) {
                        if (this.ctx.session.bot.type == 6) {
                            this.ctx.session.bot.active_token = config.host_token;
                            this.ctx.session.bot.inactive_tokens = [];
                            this.ctx.session.bot.number = 1;
                            this.ctx.session.bot.type = '5';
                            await resetTokens();

                            const new_service = await changeService(this.ctx);
                            reject({ code: 17, error: 'Changed service', service: new_service + 1 });
                            return;
                        } else {
                            this.ctx.session.bot.active_token = config.host_token;
                            this.ctx.session.bot.inactive_tokens = [];
                            this.ctx.session.bot.number = 1;
                            this.ctx.session.bot.type = '6';
                        }
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
                    axios({
                        method: 'GET',
                        url: response.data?.data?.bgRemoved,
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
     * This function might return 18 - failed to call 2nd API.
     */
    callSecondService(image) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            
            data.append('image_file_url', '');
            data.append('image_file', image.stream);
            data.append('bg_color', '');
            data.append('crop', 'false');
            data.append('crop_margin', 'px,px,px,px');
            data.append('bg_image_file_url', '');
            data.append('size', 'full');
            data.append('output_format', 'json');

            axios({
                method: 'POST',
                url: config.host2,
                headers: {
                    'X-Api-Key': config.host2_token,
                    ...data.getHeaders(),
                },
                data: data
            }).then(response => {
                resolve({
                    buffer: Buffer.from(response.data.image_raw, 'base64'),
                    initial_file_size: image.size
                });
            }).catch((err) => {
                reject({ code: 18, error: 'Failed to call 2nd API', msg: err });
            });
        });
    }

    /**
     * Calls the third service's API and converts the result to buffer.
     * @param {Object} image Image data
     * @returns Promise, an object with either data or error and its code.
     * This function might return 12 - failed to call 3rd API.
     */
    callThirdService(image) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            
            data.append('file', image.stream);

            axios({
                method: 'POST',
                url: config.host3,
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
                reject({ code: 12, error: 'Failed to call 3rd API', msg: err });
            });
        });
    }

    /**
     * Calls the fourth service's API and converts the result to buffer.
     * @param {Object} image Image data
     * @returns Promise, an object with either data or error and its code.
     * This function might return 18 - failed to call 3rd API.
     */
    callFourthService(image) {
        return new Promise(async (resolve, reject) => {
            const data = new FormData();
            const buffer = await axios({
                method: 'GET',
                url: image.url,
                responseType: 'arraybuffer'
            }).then(response => Buffer.from(response.data, 'binary'));
            
            data.append('file', buffer, 'image.jpeg');
            data.append('filenameOverride', 'true');

            axios({
                method: 'POST',
                url: config.host4,
                headers: {
                    ...data.getHeaders(),
                },
                data: data
            }).then(response => {
                axios({
                    method: 'GET',
                    url: response.data.url.replace('e/original/u', 'e/erase.bg()/u'),
                    responseType: 'arraybuffer'
                }).then(response => {
                    resolve({
                        buffer: Buffer.from(response.data, 'binary'),
                        initial_file_size: image.size
                    });
                }).catch(() => {
                    reject({ code: 10, error: 'Failed to download processed photo' });
                });
            }).catch((err) => {
                reject({ code: 18, error: 'Failed to call 4th API', msg: err });
            });
        });
    }
}; 