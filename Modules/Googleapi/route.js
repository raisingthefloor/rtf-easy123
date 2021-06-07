const gmailController = require('./Controllers/gmail.controller')

module.exports = function (router) {
    router.get('/connect', gmailController.connect.bind(gmailController))
    router.get('/googlecallback', gmailController.googleCallback.bind(gmailController))
    router.post('/api/get-unread-mails', gmailController.getAllMails.bind(gmailController))
    router.post('/api/reply-mail', gmailController.replyMail.bind(gmailController))
    router.post('/api/get-user', gmailController.getUser.bind(gmailController))
    router.post('/api/save-new-user', gmailController.saveNewUser.bind(gmailController))
    router.post('/api/login', gmailController.login.bind(gmailController))
    router.post('/api/googlecallback', gmailController.apiGoogleCallback.bind(gmailController))
    router.post('/api/connect', gmailController.apiConnect.bind(gmailController))

}