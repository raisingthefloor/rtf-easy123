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
const apiController = require('./Controllers/api.controller')
const authController = require('./Controllers/auth.controller')
const middelware = require('./Middleware/createUser')

const validateToken = require('./utils').validateToken

module.exports = function (router) {
    //protected routes
    router.post('/api/get-user', apiController.getUser.bind(apiController))
    router.post('/api/save-new-user', apiController.saveNewUser.bind(apiController))




    //unprotected routes
    router.post('/api/login', authController.login.bind(authController))
    router.post('/api/register', middelware.createUser, authController.register.bind(authController))
    router.post('/api/forgot-password', authController.forgotPassword.bind(authController))
    router.post('/api/check-forgot-password-token', authController.checkForgotPasswordToken.bind(authController))
    router.post('/api/reset-forgot-password', authController.resetForgotPassword.bind(authController))
    router.post('/api/confirmation', authController.confirmation.bind(authController))
    router.post('/api/resend-verification-mail', authController.resendVerificationEmail.bind(authController))
    router.get('/api/check-email-exists', authController.checkIfEmailExists.bind(authController))


    //delete below functions while going to productions
    //for deleting all users from database- delete in production
    router.get('/api/delete-old-data', apiController.deleteOldData.bind(apiController))
    router.get('/api/delete-all-contacts', apiController.deleteAllContacts.bind(apiController))
    router.get('/api/delete-all-users', apiController.deleteUsers.bind(apiController))
    router.get('/api/list-all-user', apiController.listAllUser.bind(apiController))
    router.get('/api/add-admin-user', apiController.addAdminUser.bind(apiController))

}