const User = require('../Modules/Googleapi/Models/user.model')

//get current logged in user from request
exports.getCurrentUser = async function (request) {
    return new Promise((resolve, reject) => {
        let user = User.findOne({id: request.decoded.id})
        resolve(user)
        /*gmail.users.messages.get({
            userId: 'me',
            id: message.id
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err + ' and Message ID: ' + message.id)
            resolve(res.data)
        })*/
    })
}