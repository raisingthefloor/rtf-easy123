const mongoose = require('mongoose')

const modelName = "token"

const schema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, expires: 86400, default: Date.now }
})

const Token = mongoose.model(modelName, schema);
module.exports = {
    Token
}