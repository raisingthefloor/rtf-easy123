const UserController = require('./Controllers/user.controller')
console.log("UserController", UserController)
module.exports = function (router) {
    router.post('/api/admin/get-users', UserController.getUsers.bind(UserController))
    router.post('/api/admin/delete-user', UserController.deleteUser.bind(UserController))
}