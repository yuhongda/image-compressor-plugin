'use strict';
const co = require('co');
const _ = require('lodash');
const tinify = require('tinify');
const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const readline = require('readline');

let imageCache = {};

function getImages(list, reg) {
    let queue = [];

    for (let key of Object.keys(list)) {
        if (reg.exec(key)) {
            queue.push({
                name: key,
                source: list[key]
            });
        }
    }
    
    return queue;
}

function* writeImg(imgBuffer, md5) {
    let filePath = yield new Promise(function(resolve, reject) {
        let filePath = path.resolve(__dirname, '../cache', md5);
        fs.writeFile(filePath, imgBuffer, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(filePath);
            }
        });
    });
    return filePath;
}

function compressImage(queue) {
    let compressedImages = [];

    return co(function*() {
        function* upload(fileInfo) {
            let fileMd5 = md5(fileInfo.source.source());

            //图片已缓存
            if(imageCache[fileMd5]){
                let cachedImage = yield new Promise(function (resolve, reject) {
                    fs.readFile(imageCache[fileMd5], function (err, buffer) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(buffer);
                        }
                    })
                });
                fileInfo.source._value = cachedImage;
                return;
            }

            let compressImg = yield new Promise((resolve, reject) => {
                tinify.fromBuffer(fileInfo.source.source()).toBuffer((err, resultData) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultData);
                    }
                })
            });
            fileInfo.source._value = compressImg;
            let filePath = yield writeImg(compressImg, fileMd5);
            imageCache[fileMd5] = filePath;
            compressedImages.push(fileInfo.name)
        }

        for (let fileInfo of queue) {
            yield upload(fileInfo);
        }

        return compressedImages;
    });
}

module.exports = (compilation, options) => {
    let reg = new RegExp("\.(" + options.ext.join('|') + ')$', 'i');
    if (options.proxy) {
        tinify.proxy = options.proxy;
    }
    return co(function*() {
        let images = getImages(compilation.assets, reg);
        tinify.key = options.key;
        let result = null;
        if (images.length > 0) {
            result = yield Promise.all([
                compressImage(images)
            ]);
        }
        return result;
    });
};