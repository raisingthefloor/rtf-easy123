
let express = require('express');
let app = require('./server');
let router = express.Router();

require('./Modules/Task/route')(router);
require('./Modules/Googleapi/route')(router);
require('./Modules/Admin/route')(router);
app.use(router)
module.exports = router;
