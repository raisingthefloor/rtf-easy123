/**
 Copyright 2020 Raising the Floor - International

 Licensed under the New BSD license. You may not use this file except in
 compliance with this License.

 You may obtain a copy of the License at
 https://github.com/GPII/universal/blob/master/LICENSE.txt

 The R&D leading to these results received funding from the:
 * Rehabilitation Services Administration, US Dept. of Education under
 grant H421A150006 (APCP)
 * National Institute on Disability, Independent Living, and
 Rehabilitation Research (NIDILRR)
 * Administration for Independent Living & Dept. of Education under grants
 H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
 * European Union's Seventh Framework Programme (FP7/2007-2013) grant
 agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
 * William and Flora Hewlett Foundation
 * Ontario Ministry of Research and Innovation
 * Canadian Foundation for Innovation
 * Adobe Foundation
 * Consumer Electronics Association Foundation
 **/
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnection = require("./config/db.config")
require('dotenv').config()
const cors = require('cors');
const fs = require('fs')
const path = require('path')
let tls = require('tls');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const upload = require('express-fileupload')


Sentry.init({
    dsn: "https://3618b3bf0670431bb5f2d9391b0e6387@o464399.ingest.sentry.io/5806040",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    environment: process.env.NODE_APP_ENV,
})




const app = module.exports = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(upload())


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
    startNonSSLServer()
}
else
{
    startSSLServer()
}

function startNonSSLServer() {
    let server = require('http').createServer(app);
    mongoConnection.connect()
    server.listen(port, function () {
        console.log('NON SSL server listening on port ' + server.address().port);
    });
}
function startSSLServer() {
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
