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
const {Folder} = require("../../Googleapi/Models/folder.model");
const {User} = require('../../Googleapi/Models/user.model')
const {AddressBook} = require('../../Googleapi/Models/addressBook.model')

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

    /**
     * Add folder to database
     */
    async addFolder(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {
            let order = 1

            let allFolders = await Folder.find({ deleted: false })
            order = allFolders.length

            const folder = await Folder.create({
                name: request.body.name,
                userId: request.body.id,
                order: order+1,
                createdBy: request.decoded.id
            })

            data.status = true
            data.data = folder
            data.message = "success"
            response.send(data)
        }
        catch (err)
        {
            logger.error('Error::' + err)
            response.send(data)
        }

    }

    /**
     * get all folders of user
     */
    async getAllFolders(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            const folders = await Folder.find({
                userId: request.body.id
            })

            data.status = true
            data.data = folders
            data.message = "success"
            response.send(data)
        }
        catch (err)
        {
            logger.error('Error::' + err)
            response.send(data)
        }
    }

    /**
     * upload images
     */
    async uploadImage(request, response) {
        var url = require('url')

        let avatar = request.files.avatar
        let filename = avatar.name

        //add to database
        let folder = await Folder.findOne({
            _id: request.body.folderId
        })
        folder.photos.push({
            name: filename,
            path: '/uploads/'+filename
        })

        await folder.save()

        avatar.mv('./public/uploads/'+filename, function (err) {
            if(err) {
                response.status(406).send({
                    status: false,
                    data: err,
                    message: 'failed'
                })
            }
            else {


                response.status(200).send({
                    status: true,
                    data: url.format({
                        protocol: request.protocol,
                        host: request.get('host'),
                        pathname: '/uploads/'+filename
                    }),
                    message: 'success'
                })
            }
        })
    }

    /**
     * update folders order
     */
    async updateFoldersOrder(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            let requestFolders = request.body.folders
            //requestFolders.forEach((folder))
            for (const folder of requestFolders) {
                await Folder.findOneAndUpdate({
                    _id: folder.id
                }, {
                    order: folder.order
                })
            }
            //let folders = await Folder.collection.insertMany(requestFolders)

            data.status = true
            data.data = requestFolders
            data.message = 'success'

            response.send(data)
        }
        catch (err) {
            logger.error('Error::' + err)
            console.log(err)
        }



    }

    /**
     * add contact
     */
    async addContact(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            let address_book = await AddressBook.create({
                userId: request.body.id,
                name: request.body.name,
                skypeid: request.body.skypeid,
                zoom_meeting_url: request.body.zoom_meeting_url,
                notes: request.body.notes,
                email: request.body.email,
                avatar: request.body.image,
                createdBy: request.decoded.id
            })

            data.status = true
            data.data = address_book
            data.message = "success"

            response.send(data)
        }
        catch (err) {
            logger.error('Error::' + err)
            console.log("error", err)
        }
    }

    /**
     * upload contact avatar
     */
    async uploadContactAvatarImage(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            var url = require('url')

            let avatar = request.files.avatar
            let filename = avatar.name

            avatar.mv('./public/uploads/'+filename, function (err) {
                if(err) {
                    response.status(406).send({
                        status: false,
                        data: err,
                        message: 'failed'
                    })
                }
                else {


                    response.status(200).send({
                        status: true,
                        data: '/uploads/'+filename,
                        message: 'success'
                    })
                }
            })

        }
        catch (err) {
            logger.error('Error::' + err)
            console.log("error", err)
        }
    }
}

module.exports = new UserController()