const Bot = require('../database/models/Bot');
const axios = require('axios');
const byteSize = require('byte-size');
const FormData = require('form-data');
const resetTokens = require('../database/resetTokens');
const config = require('../config');

module.exports = class RemoveBackground {
    constructor(data) {
        this.userId = data.userId;
        this.session = data.session;
        this.editMessageText = data.editMessageText;
        this.i18n = data.i18n;
        this.language = data.language;
        this.standby_message_id = data.standby_message_id;
        this.message = data.message;
        this.service = data.service;
        this.output = data.output;
    }

    /**
     * Removes background from given image.
     * @returns Promise, an object with either data or error and its code.
     */
    remove() {
        return new Promise(async (resolve, reject) => {
            const image = await this.getMedia();

            switch (this.service) {
                case 0:
                    this.getRequestData().then(() => {
                        this.processImage(image, 0)
                            .then((response) => resolve(response))
                            .catch((err) =>
                                reject({ code: 'PROCESSING_ERROR', error: 'Main function failure', message: err })
                            );
                    });
                    break;
                case 1:
                    this.processImage(image, 1)
                        .then((response) => resolve(response))
                        .catch((err) =>
                            reject({ code: 'PROCESSING_ERROR', error: 'Main function failure', message: err })
                        );
                    break;
                default:
                    reject({
                        code: 'UNKNOWN_SERVICE',
                        error: `Unknown service. Expected 0, 1, 2 or 3. Received ${service}`,
                    });
                    break;
            }
        });
    }

    /**
     * Downloads a picture the user sent.
     * @returns Promise, an object with either data or error and its code.
     */
    getMedia() {
        return new Promise((resolve, reject) => {
            const file_id = this.message.file_id;
            const download_url = `https://api.telegram.org/bot${config.token}/getFile?file_id=${file_id}`;

            axios(download_url)
                .then(async (response) => {
                    const file = response.data.result;
                    const url = `https://api.telegram.org/file/bot${config.token}/${file.file_path}`;

                    if (file.file_size >= 20971520) {
                        reject({ code: 'TOO_BIG_FILE', error: 'Too big file' });
                        return;
                    } else {
                        const image_stream = await axios({
                            method: 'GET',
                            url: url,
                            responseType: 'stream',
                        }).then((response) => response.data);

                        await this.editMessageText(
                            this.userId,
                            this.standby_message_id,
                            this.i18n.t('service.image_downloaded', {
                                type: this.message.type === 'photo' ? '🖼' : '📄',
                                size: byteSize(file.file_size),
                            }),
                            { parse_mode: 'HTML' }
                        ).catch((err) => {
                            console.error(err);
                        });

                        resolve({
                            code: 200,
                            stream: image_stream,
                            url: url,
                            size: file.file_size,
                            name: file.file_path.replace(/(documents\/|photos\/)/g, ''),
                        });
                    }
                })
                .catch(() => {
                    reject({ code: 'FAILED_TO_DOWNLOAD', error: 'Failed to download' });
                });
        });
    }

    /**
     * Requests data from database to make an API call to the first service.
     * @returns Promise, an object with either data or error and its code.
     */
    getRequestData() {
        return new Promise((resolve, reject) => {
            Bot.find({ id: 1 })
                .then((response) => {
                    this.session.bot = response[0];
                    resolve(response[0]);
                })
                .catch(() => {
                    reject({ code: 'PROCESSING_ERROR', error: 'Failed to get request data from database' });
                });
        });
    }

    /**
     * Processes query image via one of the services.
     * @param {Object} image Image data
     * @param {Number} service 0 - cutout.pro; 1 - benzin.io; 2 - experte.de; 3 - erase.bg
     * @returns Promise, an object with either data or error and its code.
     */
    processImage(image, service) {
        return new Promise((resolve, reject) => {
            switch (service) {
                case 0:
                    this.callFirstService(image)
                        .then((response) => resolve(response))
                        .catch((err) =>
                            reject({ code: 'PROCESSING_ERROR', error: 'Failed to process image', message: err })
                        );
                    break;
                case 1:
                    this.callSecondService(image)
                        .then((response) => resolve(response))
                        .catch((err) =>
                            reject({ code: 'PROCESSING_ERROR', error: 'Failed to process image', message: err })
                        );
                    break;
                default:
                    reject({
                        code: 'UNKNOWN_SERVICE',
                        error: `Unknown service. Expected 0, 1, 2 or 3. Received ${service}`,
                    });
                    break;
            }
        });
    }

    /**
     * Calls the first service's API and converts the result to buffer.
     * @param {Object} image Image data
     * @returns Promise, an object with either data or error and its code.
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
                10: config.host_token10,
            };
            const data = new FormData();

            data.append('file', image.stream);
            data.append('mattingType', this.session.bot.type || '5');

            axios({
                method: 'POST',
                url: config.host,
                headers: {
                    ...data.getHeaders(),
                    token: this.session.bot.active_token,
                },
                data: data,
            })
                .then(async (response) => {
                    const codes = [4000, 4001, 4002, 4003, 4004];

                    if (codes.includes(response.data.code)) {
                        if (this.session.bot?.inactive_tokens.length >= 10) {
                            if (this.session.bot.type == 6) {
                                this.session.bot.active_token = config.host_token;
                                this.session.bot.inactive_tokens = [];
                                this.session.bot.number = 1;
                                this.session.bot.type = '5';

                                await resetTokens();

                                const new_service = user.service === 0 ? 1 : 0;

                                user.service = new_service;

                                reject({ code: 'CHANGED_SERVICE', error: 'Changed service', service: new_service });
                                return;
                            } else {
                                this.session.bot.active_token = config.host_token;
                                this.session.bot.inactive_tokens = [];
                                this.session.bot.number = 1;
                                this.session.bot.type = '6';
                            }

                            reject({ code: 'NO_ACTIVE_TOKENS', error: 'No active tokens left' });

                            return;
                        } else {
                            this.session.bot?.inactive_tokens.push(this.session.bot.active_token);

                            if (this.session.bot?.number === 10) {
                                this.session.bot.active_token = config.host_token;
                                this.session.bot.number = 1;
                            } else {
                                this.session.bot.active_token = hosts[this.session.bot.number + 1];
                                ++this.session.bot.number;
                            }

                            reject({ code: 'CHANGED_TOKEN', error: 'Changed token' });

                            return;
                        }
                    } else {
                        axios({
                            method: 'GET',
                            url: response.data?.data?.bgRemoved,
                            responseType: 'arraybuffer',
                        })
                            .then((response) => {
                                resolve({
                                    buffer: Buffer.from(response.data, 'binary'),
                                    initial_file_size: image.size,
                                });
                            })
                            .catch(() => {
                                reject({ code: 'PROCESSING_ERROR', error: 'Failed to download processed photo' });
                            });
                    }
                })
                .catch((err) => {
                    reject({ code: 'API_ERROR', error: 'Failed to call API', message: err });
                });
        });
    }

    /**
     * Calls the second service's API and converts the result to buffer.
     * @param {Object} image Image data
     * @returns Promise, an object with either data or error and its code.
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
                data: data,
            })
                .then((response) => {
                    resolve({
                        buffer: Buffer.from(response.data.image_raw, 'base64'),
                        initial_file_size: image.size,
                    });
                })
                .catch((err) => {
                    reject({ code: 'API_ERROR', error: 'Failed to call 2nd API', message: err });
                });
        });
    }
};
