// load config, this has to be first
global.config = require('./config.js')();

// do not enforce ssl cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// import modules
var app = require('./app.js');

// start app
var args = require('args');
args.option('deployments', 'run deployments once then exits program', false)
    .option('checks', 'run health checks once then exits program', false)
    .option('generate', 'generate s3 files and push them', false)
    .option('deploymentsInterval', 'run deployments interval in minutes', 60)
    .option('checkstInterval', 'run health checks interval in minutes', 5);
const flags = args.parse(process.argv);
// console.log(flags);
app.start(flags);

// stop app
var shutdown = () => {
    process.exit();
};

// cleanup events
process.on('SIGTERM', shutdown); // ctrl c
process.on('SIGINT', shutdown); // ctrl z