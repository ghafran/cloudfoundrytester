var _ = require('lodash'),
    promise = require('bluebird'),
    fs = require('fs'),
    ejs = require('ejs'),
    path = require('path'),
    shell = require('shelljs'),
    rp = require('request-promise'),
    data = require('./data');

module.exports = class s3 {

    static saveFile(filename, html) {
        return new promise((resolve, reject) => {
            fs.writeFile(__dirname + `/static/${filename}`, html, {
                encoding: 'utf8',
                flag: 'w'
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(null);
                }
            });
        });
    }

    static renderFile(path, data) {
        return promise.promisify(ejs.renderFile)(path, data, {}).then((result) => {
            return result;
        });
    }

    static uploadFiles() {
        var templatePath = path.resolve(__dirname, './scripts/s3.sh.ejs');
        return s3.renderFile(templatePath, {}).then((script) => {
            console.log('script', script);
            console.log('running script...');
            var result = shell.exec(script, { async: false, silent: true }).stdout;
            console.log('upload:', result);
        });
    }

    static generate() {
        return data.getData().then((data) => {
            data._ = _;
            return s3.renderFile(path.resolve(__dirname, './views/frame.ejs'), { static: true }).then((index) => {
                return s3.renderFile(path.resolve(__dirname, './views/home.ejs'), data).then((home) => {
                    return s3.saveFile('index.html', index).then(() => {
                        return s3.saveFile('home.html', home).then(() => {
                            return s3.uploadFiles().then(() => {
                                return;
                            });
                        });
                    });
                });
            });
        });
    }
};