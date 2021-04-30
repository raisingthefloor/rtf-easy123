
let express = require('express');
let app = require('./server');
let router = express.Router();

require('./Modules/Task/route')(router);

app.use(router);
module.exports = router;
