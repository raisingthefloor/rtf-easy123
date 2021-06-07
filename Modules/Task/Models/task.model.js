const mongoose = require('mongoose');
const modelName = "todos"
const taskSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String}
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

const Task = mongoose.model(modelName, taskSchema);
module.exports = {
    Task
}