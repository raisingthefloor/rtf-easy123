const UserController = require('./Controllers/user.controller')
const validateToken = require('../Googleapi/utils').validateToken

module.exports = function (router) {
    router.post('/api/admin/get-users', validateToken, UserController.getUsers.bind(UserController))
    router.post('/api/admin/delete-user', validateToken, UserController.deleteUser.bind(UserController))
}