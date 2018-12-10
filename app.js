var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    serveStatic = require('serve-static'),
    ejs = require('ejs'),
    path = require('path'),
    routes = require('./routes'),
    deployments = require('./deployments'),
    checks = require('./checks'),
    s3 = require('./s3');

class appServer {
    static start(flags) {
        var app = express();
        app.disable('x-powered-by');
        app.disable('etag');
        app.use(serveStatic(path.resolve(__dirname, '.', 'static'), {}));
        app.set('views', path.resolve(__dirname, '.'));
        app.engine('html', ejs.renderFile);
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(compression());
        routes.setup(app, express.Router());

        if (flags.d) {
            // deployments
            appServer.startDeployments();
        } else if (flags.c) {
            // health checks
            appServer.startHealthChecks();
        } else if (flags.g) {
            // generate files for s3
            return s3.generate().then(() => {
                console.log('pushed to s3');
            });
        }

        if (!flags.d && !flags.c) {
            setInterval(() => {
                appServer.startDeployments();
            }, flags.deploymentsInterval * 60 * 1000);

            setInterval(() => {
                appServer.startHealthChecks();
            }, flags.checkstInterval * 60 * 1000);

            // start web server
            this.httpServer = http.createServer(app).listen(80);
        }
    }

    static startDeployments() {
        deployments.start().then(() => {
            console.log('deployments complete');
            return s3.generate().then(() => {
                console.log('pushed to s3');
            });
        }).caught((err) => {
            console.error(err);
        });
    }

    static startHealthChecks() {
        checks.start().then(() => {
            console.log('checks complete');
            return s3.generate().then(() => {
                console.log('pushed to s3');
            });
        }).caught((err) => {
            console.error(err);
        });
    }
}

module.exports = appServer;