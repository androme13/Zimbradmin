'use strict';
// Chargement des modules de Node.js
var fs = require('fs');
var system = require('os');
global.bcrypt = require('bcrypt-nodejs');
var ZMConf = require('nconf');
ZMConf.env().file({file: 'server-config.json'});
var bunyan = require('bunyan');
global.log = bunyan.createLogger({name: 'ZM'});
var monitor = require('./ZMModules/monitor.js');
var ServerConfig = ZMConf.get("ServerConfig");
var ExtDirectConfig = ZMConf.get("ExtDirectConfig");
var MySQLConfig = ZMConf.get("MySQLConfig");
var express = require('express');
var https = require('https');
var http = require('http');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');
var extdirect = require('extdirect');
global.mysql = require('mysql');//a supprimer par la suite
var mysql = require('mysql');
var async = require('async');
var HTTPServer; // serveur web http
var HTTPSServer; // serveur web https
var sslOpts = {
    key: fs.readFileSync('./ssl/certif.key'),
    cert: fs.readFileSync('./ssl/certif-crt.pem')
};
global.Monitor={};
global.pool = mysql.createPool({
    connectionLimit: 100,
    host: MySQLConfig.host,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database: MySQLConfig.database,
    debug: false,
    multipleStatements: true
});
monitor.init(ZMConf.get("Monitor"));
var notFound = function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
    console.log('page introuvable:');
    console.log(req);
    console.log('------------------------------------');
    //next();
};
var startPage = function (req, res) {
    res.sendFile('/client/desktop.html', {root: __dirname});
};
// définition des variables d'initialisation
//var port = 8080; // port d'ecoute
// création d'une application Express
var app = express();
// Configurations de l'application Express
// on lance les middleware de facon async afin d'accelerer
// le traitement fait par le serveur node.
function parallel(middlewares) {
    return function (req, res, next) {
        async.each(middlewares, function (mw, cb) {
            mw(req, res, cb);
        }, next);
    };
}
;
app.use(parallel([
    express.static(__dirname + '/client'),
    //compression(),
    bodyParser.json(),
    cookieParser(),
    session({
        secret: ServerConfig.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: ServerConfig.sessionMaxAge, secret: ServerConfig.sessionSecret},
        rolling: true
    })
]));
// on charge la page par defaut
app.get('/', startPage);

var directApi = extdirect.initApi(ExtDirectConfig);
var directRouter = extdirect.initRouter(ExtDirectConfig);

app.get(ExtDirectConfig.apiUrl, function (req, res) {
    try {
        directApi.getAPI(
                function (api) {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(api);
                }, req, res
                );
    } catch (e) {
        console.log(e);
    }
});
// on ignore les GET requests sur le class path de extdirect
app.get(ExtDirectConfig.classRouteUrl, function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({success: false, msg: 'Unsupported method. Use POST instead.'}));
});
// POST request process route and calls class
app.post(ExtDirectConfig.classRouteUrl, function (req, res) {
    if (req.session.userinfo ||req.body.action === "core.DXLogin") {
        directRouter.processRoute(req, res);
    } else
    {
        res.writeHead(401, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: false, msg: 'Please Login before'}));
    }
});
//création serveur http et redirection vers https
HTTPServer=http.createServer(function(req, res) {
  res.writeHead(301, {
    Location: "https://"+ServerConfig.host+":"+ServerConfig.HTTPSPort.toString()
  });
  res.end();
}).listen(ServerConfig.HTTPPort);

// creation serveur https
HTTPSServer = https.createServer(sslOpts, app).listen(ServerConfig.HTTPSPort);

log.info('ZimbradminNG server listening on port %d in %s mode', ServerConfig.HTTPSPort, app.settings.env);
log.info('Running on :', system.hostname());
log.info('Node Version: ' + process.version);
// Écoute du signal SIGINT
process.on('SIGINT', function () {
    log.info('Stopping Zimbradmin...');
    HTTPServer.close();
    HTTPSServer.close();
    process.exit();
});