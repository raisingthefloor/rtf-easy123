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

const UserController = require('./Controllers/user.controller')
const EasyWebController = require('./Controllers/easyweb.controller')
const validateToken = require('../Auth/utils').validateToken

module.exports = function (router) {
    router.post('/api/assistant/get-users', validateToken, UserController.getUsers.bind(UserController))
    router.post('/api/assistant/delete-user', validateToken, UserController.deleteUser.bind(UserController))
    router.post('/api/assistant/user/detail', validateToken, UserController.userDetails.bind(UserController))
    router.post('/api/assistant/member/save-profile', validateToken, UserController.userProfileSave.bind(UserController))
    router.post('/api/assistant/member/save-imapsmtp-details', validateToken, UserController.userImapSmtpSave.bind(UserController))
    router.post('/api/assistant/user/add-folder', validateToken, UserController.addFolder.bind(UserController))
    router.post('/api/assistant/user/get-all-folders', validateToken, UserController.getAllFolders.bind(UserController))
    router.post('/api/assistant/user/update-folders-order', validateToken, UserController.updateFoldersOrder.bind(UserController))

    //easyweb routes
    router.post('/api/assistant/user/easyweb/add-folder', validateToken, EasyWebController.addFolder.bind(EasyWebController))
    router.post('/api/temp/upload-image', EasyWebController.uploadImage.bind(EasyWebController))
    router.post('/api/assistant/user/easyweb/add-website', validateToken, EasyWebController.addWebsite.bind(EasyWebController))
    router.post('/api/assistant/user/easyweb/get-all-websites-and-folders', validateToken, EasyWebController.getWebsitesAndFolders.bind(EasyWebController))
    router.post('/api/assistant/user/easyweb/change-order-websites-and-folders', validateToken, EasyWebController.changeOrderOfWebsitesAndFolders.bind(EasyWebController))
    router.post('/api/assistant/user/easyweb/get-website-snapshot-from-url', validateToken, EasyWebController.getWebsiteSnapshotFromURL.bind(EasyWebController))
    router.post('/api/assistant/user/easyweb/delete-website-or-folder', validateToken, EasyWebController.deleteWebsiteOrFolder.bind(EasyWebController))
    router.post('/api/assistant/user/easyweb/website-fav', validateToken, EasyWebController.websiteFav.bind(EasyWebController))



















    router.post('/api/upload-image', UserController.uploadImage.bind(UserController))
    router.post('/api/get-private-image', UserController.getPrivateImage.bind(UserController))

    //address book
    router.post('/api/assistant/user/get-all-contacts', validateToken, UserController.getAllContacts.bind(UserController))
    router.post('/api/assistant/user/add-contact', validateToken, UserController.addContact.bind(UserController))
    router.post('/api/assistant/user/edit-contact', validateToken, UserController.editContact.bind(UserController))
    router.post('/api/upload-contact-avatar-image', UserController.uploadContactAvatarImage.bind(UserController))
}