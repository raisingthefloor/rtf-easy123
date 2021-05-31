const gmailController = require('./Controllers/gmail.controller')

module.exports = function (router) {
    router.get('/connect', gmailController.getMails.bind(gmailController))
    router.post('/api/get-unread-mails', gmailController.getAllMails.bind(gmailController))
    router.post('/api/reply-mail', gmailController.replyMail.bind(gmailController))

}