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
const logger = require('../../../logger/api.logger')
const {Folder} = require("../../Auth/Models/folder.model")
const HelperManager = require("../../../Managers/HelperManager")
const Sentry = require("@sentry/node")

class UserController {
    async getFolders(request, response) {
        let data = {
            status: false,
            data: null,
            message: ""
        }
        
        try
        {
            let user = await HelperManager.getLoggedInUser(request.decoded)

            let folders = await Folder.find({
                userId: user.id
            })

            data.status = true
            data.data = folders
            data.message = "success"
            response.send(data)
        }
        catch (err)
        {
            console.log(err)
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
        }
    }
}

module.exports = new UserController()