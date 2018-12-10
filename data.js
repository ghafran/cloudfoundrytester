var _ = require('lodash'),
    fs = require('fs'),
    promise = require('bluebird');

module.exports = class data {

    static readFile(file) {
        return new promise((resolve, reject) => {
            fs.readFile(__dirname + `/${file}`, 'utf8', (err, cache) => {
                if (err) {
                    reject(err);
                } else {
                    var data = JSON.parse(cache);
                    resolve(data);
                }
            });
        });
    }

    static getData() {
        return this.readFile('deployments.json').then((deployments) => {
            return this.readFile('checks.json').then((checks) => {
                deployments.checks_last_updated = checks.last_updated;
                _.each(deployments.results, (result) => {
                    var check = _.find(checks.results, { app: result.app });
                    result.check = check;
                });
                return deployments;
            });
        });
    }
};