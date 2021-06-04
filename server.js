const express = require('express');
const bodyParser = require('body-parser');
const mongoConnection = require("./config/db.config")
require('dotenv').config()
const cors = require('cors');
const fs = require('fs')
const path = require('path')

const app = module.exports = express();

app.use(cors())

/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});*/



const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
    limit: '100mb'
}));

require('./routes');
app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});



startNonSSLServer()
//startSSLServer()
function startNonSSLServer() {
    let server = require('http').createServer(app);
    mongoConnection.connect()
    server.listen(port, function () {
        console.log('NON SSL server listening on port ' + server.address().port);
    });
}
function startSSLServer() {
    let server = require('https').createServer({
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    },app);
    mongoConnection.connect()
    server.listen(port, function () {
        console.log('NON SSL server listening on port ' + server.address().port);
    });
}

