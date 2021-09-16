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
const {Folder} = require("../../Auth/Models/folder.model");
const {User} = require('../../Auth/Models/user.model')
const {AddressBook} = require('../../Auth/Models/addressBook.model')
const fs = require('fs')
const HelperManager = require("../../../Managers/HelperManager");
const aws = require("aws-sdk")
const Sentry = require("@sentry/node")


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
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
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
            data.error = err
            data.message = 'failed'

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
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

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
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

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
                smtpPortNumber: request.body.smtp_port,
                smtpUseTlsSsl: request.body.smtp_use_tls_ssl,
                smtpAuthentication: request.body.smtp_authentication
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
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

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
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

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
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

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
        let mimetype = avatar.mimetype

        //console.log("buffer data" + request.files.avatar.data)

        aws.config.update({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
        })

        const s3 = new aws.S3()
        let uniqid = await HelperManager.uniqid()
        filename = uniqid + "-" + filename
        let bucket_path = process.env.AWS_S3_BUCKET + "/" + request.body.id + "/photos"
        const s3res = await s3.upload({
            Bucket: bucket_path,
            Key: filename,
            Body: request.files.avatar.data,
            ACL: "private"
        }).promise()


        const s3data =  await s3.getObject(
            {
                Bucket: bucket_path,
                Key: filename
            }
        ).promise();

        const b64 = Buffer.from(s3data.Body).toString('base64');

        //console.log("s3res data", s3data)
        //console.log("s3res data", s3data.Body)


        //add to database
        let folder = await Folder.findOne({
            _id: request.body.folderId
        })

        folder.photos.push({
            name: filename,
            path: bucket_path,
            mimetype: mimetype
        })
        await folder.save()
        //end add to database


        response.status(200).send({
            status: true,
            data: folder,
            message: 'success'
        })



        /*avatar.mv('./public/uploads/'+filename, function (err) {
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
        })*/
    }

    /**
     * get private image from amazon s3
     */
    async getPrivateImage(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try
        {
            aws.config.update({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                signatureVersion: 'v4',
                region: 'us-east-2'
            })
            const s3 = new aws.S3()
            if(request.body.signed)
            {
                const s3data =  await s3.getSignedUrl('getObject',
                    {
                        Bucket: request.body.photo.path,
                        Key: request.body.photo.name,
                        Expires: 60*5
                    }
                )

                data.status = true
                data.data = s3data
                data.message = "success"

                response.send(data)
            }
            else
            {
                const s3data =  await s3.getObject(
                    {
                        Bucket: request.body.photo.path,
                        Key: request.body.photo.name
                    }
                ).promise();
                const b64 = Buffer.from(s3data.Body).toString('base64')

                data.status = true
                data.data = b64
                data.message = "success"

                response.send(data)
            }

        }
        catch (err)
        {
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

            response.send(data)
        }
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
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

            response.send(data)
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

        try
        {
            //create image from base64 data
            /*let base64String = request.body.avatar // Not a real image
            let buff = new Buffer(base64String, 'base64');
            fs.writeFileSync('stack-abuse-logo-out.png', buff);


            //console.log(base64String)
            fs.writeFile('image.png', base64String, {encoding: 'base64'}, function(err) {
                console.log('File created');
            });*/

            let uniqid = await HelperManager.uniqid()
            let string = request.body.avatar
            let mimetype = string.substring(string.indexOf(":")+1, string.indexOf(";"))




            let regex = /^data:.+\/(.+);base64,(.*)$/;

            let matches = string.match(regex);

            //console.log("mimetype", mimetype)
            let ext = matches[1];
            let data1 = matches[2];
            let buffer = Buffer.from(data1, 'base64');
            //let filename = await HelperManager.uniqid()
            let filepath = "public/uploads/avatar/"
            //let complete_filepath = "uploads/avatar/"+filename+'.' + ext
            //fs.writeFileSync(filepath+filename+'.' + ext, buffer);




            aws.config.update({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
            })
            const s3 = new aws.S3()
            let filename = uniqid+"."+ext
            let bucket_path = process.env.AWS_S3_BUCKET + "/" + request.body.id + "/addressBook"

            const s3res = await s3.upload({
                Bucket: bucket_path,
                Key: filename,
                Body: buffer,
                ACL: "private"
            }).promise()





            // Remove header
            //let base64Image = base64String.split(';base64,').pop()

            //console.log("body", request.body)
            let address_book = await AddressBook.create({
                userId: request.body.id,
                contactName: request.body.name,
                skypeId: request.body.skypeid,
                zoomMeetingURL: request.body.zoom_meeting_url,
                notes: request.body.notes,
                email: request.body.email,
                avatarPath: bucket_path,
                avatarMIME: mimetype,
                avatarName: filename,
                createdBy: request.decoded.id
            })

            for (let i = 0; i < request.body.phoneNumber.length; i++)
            {
                address_book.phoneNumber.push({
                    number: request.body.phoneNumber[i].number,
                    type: request.body.phoneNumber[i].type,
                    carrier: request.body.phoneNumber[i].carrier
                })
            }
            
            address_book.save()

            data.status = true
            data.data = address_book
            data.message = "success"

            response.send(data)
        }
        catch (err)
        {
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

            response.send(data)
        }
    }

    /**
     * delete address book contact
     */
    async deleteAddressBookContact(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let contact = await AddressBook.findOne({
                _id: request.body.contact_id
            })

            if(contact.avatarName)
            {
                //delete amazon s3 image
                aws.config.update({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
                })
                const s3 = new aws.S3()

                let deleted_data = await s3.deleteObject({
                    Bucket: contact.avatarPath,
                    Key: contact.avatarName
                }).promise()
            }


            await AddressBook.deleteOne({
                _id: request.body.contact_id
            })

            data.status = true
            data.data = contact
            data.message = 'success'

            response.send(data)
        }
        catch (err) {
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
     * edit contact
     */
    async editContact(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            //create image from base64 data
            /*let base64String = request.body.avatar // Not a real image
            let buff = new Buffer(base64String, 'base64');
            fs.writeFileSync('stack-abuse-logo-out.png', buff);


            //console.log(base64String)
            fs.writeFile('image.png', base64String, {encoding: 'base64'}, function(err) {
                console.log('File created');
            });*/



            // Remove header
            //let base64Image = base64String.split(';base64,').pop()

            let update_data = {
                contactName: request.body.name,
                skypeId: request.body.skypeid,
                zoomMeetingURL: request.body.zoom_meeting_url,
                notes: request.body.notes,
                email: request.body.email
            }
            //console.log("body", request.body)
            if(request.body.image_changed)
            {
                let string = request.body.avatar
                let regex = /^data:.+\/(.+);base64,(.*)$/;

                let matches = string.match(regex);
                let ext = matches[1];
                let data1 = matches[2];
                let buffer = Buffer.from(data1, 'base64');
                let filename = await HelperManager.uniqid()
                let filepath = "public/uploads/avatar/"
                let complete_filepath = "uploads/avatar/"+filename+'-edit.' + ext
                fs.writeFileSync(filepath+filename+'-edit.' + ext, buffer);
                update_data.avatar = complete_filepath
                update_data.avatarMIME = request.body.avatarMIME
            }

            await AddressBook.findOneAndUpdate({
                _id: request.body.edit_id
            }, update_data)

            let address_book = await AddressBook.findOne({
                _id: request.body.edit_id
            })

            /*await AddressBook.create({
                userId: request.body.id,
                contactName: request.body.name,
                skypeId: request.body.skypeid,
                zoomMeetingURL: request.body.zoom_meeting_url,
                notes: request.body.notes,
                email: request.body.email,
                avatar: complete_filepath,
                createdBy: request.decoded.id
            })*/

            data.status = true
            data.data = address_book
            data.message = "success"

            response.send(data)
        }
        catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

            response.send(data)
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
        catch (err)
        {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

            response.send(data)
        }
    }

    /**
     * get all contacts of user
     */
    async getAllContacts(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            let addressBooks = await AddressBook.find({
                deleted: false,
                userId: request.body.id
            })

            data.status = true
            data.data = addressBooks
            data.message = "success"

            response.send(data)
        }
        catch (err)
        {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.status = false
            data.data = null
            data.error = err
            data.message = 'failed'

            response.send(data)
        }
    }
}

module.exports = new UserController()