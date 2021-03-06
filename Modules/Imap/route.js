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
const imapController = require('./Controllers/imap.controller')
const validateToken = require('../Auth/utils').validateToken

module.exports = router => {
    //protected routes
    router.get('/api/users/:id/messages',validateToken, imapController.getAllMails.bind(imapController));
    router.delete('/api/message/:id/delete',validateToken, imapController.deleteEmailMessages.bind(imapController))
    router.post('/api/message/send', validateToken, imapController.sendMail.bind(imapController));
    router.put('/api/message/move/:box', validateToken, imapController.moveMail.bind(imapController));
    router.put('/api/message/:uid/set-flag/:flag', validateToken, imapController.setFlags.bind(imapController));

    //test credentials
    router.get('/api/assistant/member/test-incoming-mail', validateToken, imapController.testIMAPConnection.bind(imapController))
    router.post('/api/assistant/member/test-outgoing-mail', validateToken, imapController.testSMTPConnection.bind(imapController))
}