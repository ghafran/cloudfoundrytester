var _ = require('lodash'),
    promise = require('bluebird'),
    fs = require('fs'),
    ejs = require('ejs'),
    path = require('path'),
    shell = require('shelljs'),
    rp = require('request-promise');

class checks {

    static saveCache(cache) {
        return new promise((resolve, reject) => {
            var str = JSON.stringify(cache);
            fs.writeFile(__dirname + '/checks.json', str, {
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

    static runHealthCheck(deployment) {
        if (!deployment.enabled) {
            return promise.resolve();
        }

        // get app url
        var templatePath = path.resolve(__dirname, './scripts/check.sh.ejs');
        return checks.renderFile(templatePath, deployment).then((script) => {
            console.log('script', script);
            console.log('running script...');
            var result = shell.exec(script, { async: false, silent: true }).stdout;
            console.log('result:', result);

            var start = result.indexOf('routes:') + 7;
            var end = result.indexOf('\n', start);
            var route = result.substr(start, end - start);
            var url = `https://${route.trim()}/`;
            route = `https://${route.trim()}/health`;
            console.log('route', route);

            // check url
            return rp({
                method: 'GET',
                url: route
            }).then(() => {
                return {
                    app: deployment.app,
                    route: url,
                    success: true
                };
            }).caught(() => {
                return {
                    app: deployment.app,
                    route: url,
                    success: false
                };
            });
        });
    }

    static runHealthChecks() {
        var results = [];
        return promise.mapSeries(global.config.deployments, (deployment) => {
            return checks.runHealthCheck(deployment).then((result) => {
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
        return checks.runHealthChecks().then((results) => {
            console.log('results', results);
            cache.results = results;
            return checks.saveCache(cache).then(() => {
                console.log('results saved');
                return;
            });
        });
    }
}

module.exports = checks;