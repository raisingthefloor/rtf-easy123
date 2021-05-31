let mongoose = require('mongoose');
const logger = require('../logger/api.logger');
mongoose.Promise = global.Promise;

const connect = () => {
    //process.env.HOST = "localhost";
    const url =  `mongodb://${process.env.HOST}:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`;
    logger.info("process.env.MONGO_CONNECTION_STRING :::" + url);
    let options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }

    mongoose.connect(url, options).then(connection => {
        console.log("✅ ✅ ✅ --- Mongo DB connected --- ✅ ✅ ✅")
    }).catch(error => {
        console.log(error)
    });

    mongoose.connection.on("error", (err) => {
        logger.error("Error connecting to database  ", err);
    });
}

const disconnect = () => {

    if (!mongoose.connection) {
        return;
    }

    mongoose.disconnect();

    mongoose.once("close", async () => {
        console.log("Diconnected  to database");
    });

};

module.exports = {
    connect,
    disconnect
}