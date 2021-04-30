const express = require('express');
const bodyParser = require('body-parser');
const mongoConnection = require("./config/db.config")
require('dotenv').config()


const app = module.exports = express();
const port = process.env.PORT || 3000;
require('./routes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
    limit: '100mb'
}));
app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
startNonSSLServer()
function startNonSSLServer() {
    let server = require('http').createServer(app);
    mongoConnection.connect()
    server.listen(port, function () {
        console.log('NON SSL server listening on port ' + server.address().port);
    });
}

