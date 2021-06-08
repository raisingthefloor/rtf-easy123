const express = require('express');
const bodyParser = require('body-parser');
const mongoConnection = require("./config/db.config")
require('dotenv').config()
const cors = require('cors');
const fs = require('fs')
const path = require('path')
let tls = require('tls');

const app = module.exports = express();
const port = process.env.PORT || 3000;

app.use(cors())

/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
    limit: '100mb'
}));
require('./routes');

app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

if(process.env.NODE_LOCAL_HOST == 'true')
{
    console.log("true")
    startNonSSLServer()
}
else
{
    console.log("false")
    startSSLServer()
}

function startNonSSLServer() {
    logENV()
    let server = require('http').createServer(app);
    mongoConnection.connect()
    server.listen(port, function () {
        console.log('NON SSL server listening on port ' + server.address().port);
    });
}
function startSSLServer() {
    logENV()
    sslDomain = "easy123.plenartech.com"
    const options = {
        SNICallback: function (domain, cb) {

            try {
                console.log('🌐  SSL Domain Requested: ' + domain);
                const securetls = tls.createSecureContext({
                    key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`),
                    cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`),
                    ca: fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`)
                })
                if (securetls) {
                    if (cb) {
                        cb(null, securetls);
                    } else {
                        return securetls;
                    }
                } else {
                    console.log('No keys/certificates for domain requested ' + domain);
                }
            } catch (e) {
                console.error(e)
            }

        },
        key: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/privkey.pem`),
        cert: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/cert.pem`),
        ca: fs.readFileSync(`/etc/letsencrypt/live/${sslDomain}/chain.pem`)

    }
    mongoConnection.connect()
    let server = require('https').createServer(options,app);
    server.listen(port, function () {
        console.log('SSL server listening on port ' + server.address().port);
    });
}


function logENV() {

    console.log()
    console.log('======================== PORT FETCHING START ================================')
    console.log(port)
    console.log('======================== PORT FETCHING END ================================== ')
    console.log ('********************************************************************')
    console.log('============================== ENV GLOBAL START ====================')
    console.log(process.env)
    console.log('============================== ENV GLOBAL END ======================')
    console.log('********************************************************************')
}