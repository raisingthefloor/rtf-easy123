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
const {Folder} = require("../Models/folder.model");
const {AddressBook} = require("../Models/addressBook.model");
const {User} = require('../Models/user.model')
const Sentry = require("@sentry/node")
const bcrypt = require('bcrypt')

class ApiController {

    /**
     * find user by id
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async getUser(request, response) {
        try {
            const users = await User.find({_id: request.body.id});
            //console.log('users:::', users);
            response.send(users);
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)
        }
    }

    async saveNewUser(request, response) {
        let data = {}
        try {
            data = await User.updateOne({
                _id: request.body.id
            }, {$set: {
                    name: request.body.name,
                    password: request.body.password
                }})
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)
        }
        response.send(data)
    }

    /**
     * delete old data of user table
     */
    async deleteOldData(request, response) {
        let data = {"status": false}
        try {
            await User.deleteMany({})
            await Folder.deleteMany({})
            await AddressBook.deleteMany({})
            data.status = true
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)
            data.err = err
        }

        response.send(data)
    }

    /**
     * delete old data of user table
     */
    async deleteUsers(request, response) {
        let data = {"status": false}
        try {
            await User.deleteMany({})
            //await Folder.deleteMany({})
            //await AddressBook.deleteMany({})
            data.status = true
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)
            data.err = err
        }

        response.send(data)
    }

    /**
     * delete all contacts
     */
    async deleteAllContacts(request, response) {
        let data = {"status": false}
        try {
            await AddressBook.deleteMany({})
            data.status = true
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)
            data.err = err
        }

        response.send(data)
    }

    /**
     * list all users
     */
    async listAllUser(request, response) {
        let data = {"status": false}
        try {

            data.data = await User.find({})
            data.status = true
            response.send(data)
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)
            data.err = err
            response.send(data)
        }


    }

    /**
     * add admin user
     */
    async addAdminUser(request, response)
    {
        let data = {"status": false}
        try {
            let name = request.query.name
            let email = request.query.email
            let password = request.query.password
            if(!name)
            {
                name = "Admin"
            }
            if(!password)
            {
                name = "Jatin@123"
            }

            let existingUser = await User.findOne({
                email: email,
                deleted: false
            })

            if(existingUser)
            {
                response.send({
                    status: false,
                    message: "User already exists."
                })
                return
            }

            const saltRounds = 10
            let hash = await bcrypt.hash(password, saltRounds)

            const user = new User({
                role: "admin",
                emailVerified: true,
                name: name,
                email: email,
                password: hash
            });
            await user.save()
            data.status = true
            response.send(data)
            return
        } catch (err) {
            logger.error('Error::' + err)
            data.err = err
            Sentry.captureException(err)
            response.send(data)
            return
        }

        //response.send(data)
    }


}

module.exports = new ApiController();