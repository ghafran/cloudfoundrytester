module.exports = function() {
    return {
        env: 'dev',
        node_env: 'development',
        version: '1.0.0',
        deployments: [{
            enabled: true,
            app: 'gt-postgresql',
            service: 'postgresql',
            plan: 'v9.6-dev',
            servicename: 'gt-postgresql',
            gitrepo: 'https://github.com/ghafran/cf-sample-app-nodejs.git',
            gitreponame: 'cf-sample-app-nodejs'
        }, {
            enabled: true,
            app: 'gt-redis',
            service: 'redis',
            plan: 'v3.0-dev',
            servicename: 'gt-redis',
            gitrepo: 'https://github.com/ghafran/cf-sample-app-nodejs.git',
            gitreponame: 'cf-sample-app-nodejs'
        }],
        checks: [{
            group: 'Prod',
            name: 'URL1',
            url: 'about:blank'
        }]
    };
};