const gmailController = require('./Controllers/gmail.controller')
const authController = require('./Controllers/auth.controller')
const middelware = require('./Middleware/createUser')

const validateToken = require('./utils').validateToken

module.exports = function (router) {
    //protected routes
    router.post('/api/connect', validateToken, gmailController.apiConnect.bind(gmailController))
    router.post('/api/googlecallback', validateToken, gmailController.apiGoogleCallback.bind(gmailController))
    router.post('/api/get-unread-mails', validateToken, gmailController.getAllMails.bind(gmailController))
    router.post('/api/reply-mail', validateToken, gmailController.replyMail.bind(gmailController))
    router.post('/api/get-user', gmailController.getUser.bind(gmailController))
    router.post('/api/save-new-user', gmailController.saveNewUser.bind(gmailController))




    //unprotected routes
    router.post('/api/login', authController.login.bind(authController))
    router.post('/api/register', middelware.createUser, authController.register.bind(authController))
    router.post('/api/confirmation', authController.confirmation.bind(authController))
    router.post('/api/resend-verification-mail', authController.resendVerificationEmail.bind(authController))


    router.get('/connect', gmailController.connect.bind(gmailController))
    router.get('/googlecallback', gmailController.googleCallback.bind(gmailController))

    router.get('/api/delete-old-data', gmailController.deleteOldData.bind(gmailController))

}