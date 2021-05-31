const express = require('express');
const bodyParser = require('body-parser');
const mongoConnection = require("./config/db.config")
require('dotenv').config()
const cors = require('cors');

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
function startNonSSLServer() {
    let server = require('http').createServer(app);
    mongoConnection.connect()
    server.listen(port, function () {
        console.log('NON SSL server listening on port ' + server.address().port);
    });
}

