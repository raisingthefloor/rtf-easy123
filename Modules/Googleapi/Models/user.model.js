const mongoose = require('mongoose');
const modelName = "user"
const userSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    google_authentication_code: {type: String}
}, {
    collection: modelName, autoIndex: true, timestamps: true,
    toObject: {
        transform: function (doc, obj) {
            obj.id = obj._id;
            delete obj._id;
        }
    },
    toJSON: {
        transform: function (doc, obj) {
            obj.id = obj._id;
            delete obj._id;
        }
    }
});

const User = mongoose.model(modelName, userSchema);
module.exports = {
    User
}