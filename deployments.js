var _ = require('lodash'),
    promise = require('bluebird'),
    fs = require('fs'),
    moment = require('moment'),
    ejs = require('ejs'),
    path = require('path'),
    shell = require('shelljs'),
    rp = require('request-promise');

class deployments {

    static saveCache(cache) {
        return new promise((resolve, reject) => {
            var str = JSON.stringify(cache);
            fs.writeFile(__dirname + '/deployments.json', str, {
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

    static runDeployment(deployment) {
        if (!deployment.enabled) {
            return promise.resolve();
        }
        var templatePath = path.resolve(__dirname, './scripts/deploy.sh.ejs');
        return deployments.renderFile(templatePath, deployment).then((script) => {
            console.log('script', script);
            console.log('running script...');
            var result = shell.exec(script, { async: false, silent: true }).stdout;
            console.log('result:', result);
            return {
                success: true,
                app: deployment.app,
                result: result
            };
        });
    }

    static runDeployments() {
        console.log(process.env);
        var results = [];
        return promise.mapSeries(global.config.deployments, (deployment) => {
            return deployments.runDeployment(deployment).then((result) => {
                if (result) {
                    results.push(result);
                }
            });
        }).then(() => {
            return results;
        });
    }

    static start() {
        var cache = {
            last_updated: new Date().getTime()
        };
        return deployments.runDeployments().then((results) => {
            console.log('results', results);
            cache.results = results;
            return deployments.saveCache(cache).then(() => {
                console.log('results saved');
                return;
            });
        });
    }
}

module.exports = deployments;