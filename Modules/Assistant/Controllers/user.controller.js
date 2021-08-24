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
const bcrypt = require("bcrypt");
const {User} = require('../../Googleapi/Models/user.model')

class UserController {
    /**
     * get all non deleted, subscriber users
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
            data.data = await User.find({
                $or:[
                    {
                        createdBy: request.decoded.id
                    },
                    {
                        _id: request.decoded.id
                    }
                ],
                deleted: false
            })
            //console.log("dat", data)
            response.send(data)
        } catch (err) {
            logger.error('Error::' + err)
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
            logger.error('Error::' + err)
            response.send(data)
        }
    }

    /**
     * get user details
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async userDetails(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {
            data.status = true
            data.data = await User.findOne({
                _id: request.body.id
            })
            response.send(data)
        } catch (err) {
            logger.error('Error::' + err)
            response.send(data)
        }

    }

    /**
     * save user profile tab
     */
    async userProfileSave(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            //get user with id
            const user_exists = await User.findOne({
                _id: { $ne: request.body.id },
                email: request.body.email
            })

            if(user_exists)
            {
                data.status = false
                data.message = "user_exists"
                response.send(data)
                return
            }
            else // user does not exists with the same email id
            {
                let update_data = {
                    email: request.body.email
                }

                if(request.body.password)
                {
                    const saltRounds = 10
                    let hash = await bcrypt.hash(request.body.password, saltRounds)
                    update_data.password = hash
                }

                await User.findOneAndUpdate({
                    _id: request.body.id
                }, update_data)

                const user = await User.findOne({
                    _id: request.body.id
                })

                data.status = true
                data.data = user
                data.message = "success"
                response.send(data)

            }

        } catch (err) {
            logger.error('Error::' + err)
            response.send(data)
        }
    }

    /**
     * Save IMAP & SMTP details
     */
    async userImapSmtpSave(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            let update_data = {
                imapUsername: request.body.imap_username,
                imapPassword: request.body.imap_password,
                imapHost: request.body.imap_host,
                smtpUsername: request.body.smtp_username,
                smtpPassword: request.body.smtp_password,
                smtpHost: request.body.smtp_host,
                smtpPortNumber: request.body.smtp_port
            }

            await User.findOneAndUpdate({
                _id: request.body.id
            }, update_data)

            const user = await User.findOne({
                _id: request.body.id
            })

            data.status = true
            data.data = user
            data.message = "success"
            response.send(data)
        } catch (err) {
            logger.error('Error::' + err)
            response.send(data)
        }
    }
}

module.exports = new UserController()