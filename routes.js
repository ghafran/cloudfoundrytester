var frame = require('./frame'),
    home = require('./home');

module.exports = class {
    static setup(app, router) {
        router.all('/', frame);
        router.all('/home', home);
        app.use(router);
    }
};