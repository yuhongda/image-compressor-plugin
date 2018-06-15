'use strict';
require('babel-polyfill')
const compressor = require('./src/compressor.js');
const readline = require('readline');
const ora = require('ora')
const chalk = require('chalk')

class ImageCompressorPlugin {
    constructor(options) {
        debugger;
        this.pluginName = 'image-compressor-plugin';
        this.options = Object.assign({}, {
            key: '',
            ext: ['png', 'jpeg', 'jpg'],
            proxy: ''
        }, options);
    }
    apply(compiler) {
        const self = this;
        compiler.plugin("emit", function(compilation, callback) {
            const spinner = ora('image compressing...')
            spinner.start()
            return compressor(compilation, self.options).then((result) => {
                callback()
                spinner.stop()
                console.log(chalk.green(`⚓ image compress completed: `))
                result[0].forEach(filename => {
                    console.log(chalk.gray(`${filename}`))
                });
            }).catch((e) => {
                console.log(e)
            });
        });
    }
}


module.exports = ImageCompressorPlugin;