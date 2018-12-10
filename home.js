var _ = require('lodash'),
    data = require('./data');

class controller {
    constructor(context) {
        this.context = context || {};
    }

    index() {
        return data.getData().then((data) => {
            return data;
        });
    }
}

module.exports = function(req, res, next) {
    new controller(req).index().then(function(data) {
        data._ = _;
        res.render('views/home.ejs', data);
    }).caught(function(err) {
        next(err);
    });
};