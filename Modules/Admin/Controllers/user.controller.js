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
const {User} = require('../../Auth/Models/user.model')
const Sentry = require("@sentry/node")

class UserController {
    /**
     * get all non deleted users
     * @param request
     * @param response json data of users
     * @returns {Promise<void>}
     */
    async getUsers(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            data.status = true
            data.data = await User.find({deleted: false})
            response.send(data)
        } catch (err) {
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            //data.error = err
            data.message = 'failed'

            response.send(data)
        }
    }

    /**
     * delete the user with id
     * @param request
     * @param response json data of users
     * @returns {Promise<void>}
     */
    async deleteUser(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {
            //find one
            let user = await User.findOne({_id:request.body.id}).exec()

            //soft delete
            user = await user.softdelete()

            data.status = true
            data.data = await User.find({deleted:false})

            response.send(data)
        } catch (err) {
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            //data.error = err
            data.message = 'failed'

            response.send(data)
        }
    }
}

module.exports = new UserController()