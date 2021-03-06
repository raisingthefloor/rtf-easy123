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
const mongoose = require('mongoose');

const modelName = "addressBook"

const phoneNumber = {
    type: new mongoose.Schema(
        {
            number: {type: String, trim: true},
            type: {type: String, trim: true},
            carrier: {type: String, trim: true, default: null}
        }
    )
}

const schema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,

    contactName: { type: String },
    skypeId: { type: String, default: null },
    zoomMeetingURL: { type: String, default: null },
    notes: { type: String, default: null },
    email: [String],
    phoneNumber: [phoneNumber],
    avatar: { type: String, default: null },
    avatarPath: { type: String, default: null },
    avatarMIME: { type: String, default: null },
    avatarName: { type: String, default: null },

    createdBy: mongoose.Schema.ObjectId,
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


const AddressBook = mongoose.model(modelName, schema);
module.exports = {
    AddressBook
}