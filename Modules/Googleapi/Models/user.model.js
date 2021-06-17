//import softDelete from 'mongoose-softdelete'
const mongoose = require('mongoose');
//const softDelete = require('mongoose-softdelete');
const modelName = "user"
const schema = new mongoose.Schema({
    name: {type: String},
    role: {type: String, default: "subscribed"},
    email: {type: String},
    password: {type: String},
    google_authentication_code: {type: String},
    deleted: {type: Boolean},
    deletedAt: {type: Date}
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


//for soft delete
schema.add({ deleted: Boolean });
schema.add({ deletedAt: Date });

schema.pre('save', function (next) {
    if (!this.deleted) {
        this.deleted = false;
    }

    if (!this.deletedAt) {
        this.deletedAt = null;
    }

    next();
});

schema.methods.softdelete = async function(callback) {
    this.deleted = true
    this.deletedAt = new Date()
    await this.save()
    return this
};

schema.methods.restore = async function() {
    this.deleted = false
    this.deletedAt = null
    await this.save()
    return this
};

schema.query.isDeleted = async function(cond) {
    if (typeof cond === 'undefined') {
        cond = true;
    }

    return this.find({
        deleted: cond
    });
};
//end for soft delete


const User = mongoose.model(modelName, schema);
module.exports = {
    User
}