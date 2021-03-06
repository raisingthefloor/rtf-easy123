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
     * rename folder
     */
    async updateFolder(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {
            let folder = await Folder.updateOne({
                _id: request.body.edit_id
            }, {
                name: request.body.name
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
     * rename folder photo
     */
    async updateFolderPhoto(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {
            aws.config.update({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
            })
            const s3 = new aws.S3()
            let folder = await Folder.findOne({
                _id: request.body.folder_id
            })
            let photo = folder.photos.find(obj => obj._id == request.body.edit_id)
            /*let folder = await Folder.updateOne({
                _id: request.body.edit_id
            }, {
                name: request.body.name
            })*/
            let bucket = process.env.AWS_S3_BUCKET
            let source_name = photo.path

            let new_source_name = photo.path.replace(photo.name, request.body.name)

            let copyParams = {
                Bucket: bucket,
                CopySource: bucket + "/" +source_name,
                Key: new_source_name
            }
            //console.log("copyParams", copyParams)
            await s3.copyObject(copyParams).promise()

            let deleteParams = {
                Bucket: bucket,
                Key: source_name
            }
            //console.log("deleteParams", deleteParams)
            await s3.deleteObject(deleteParams).promise()

            let s = await Folder.updateOne({
                "photos": {
                    "$elemMatch": {
                        "_id": request.body.edit_id
                    }
                }
            }, {
                "$set": {
                    "photos.$.name": request.body.name,
                    "photos.$.path": new_source_name
                }
            })

            let folderNew = await Folder.findOne({
                _id: request.body.folder_id
            })



            data.status = true
            data.data = folderNew
            data.message = "success"
            response.send(data)
        }
        catch (err)
        {
            console.log(err)
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
     * delete folder
     */
    async deleteFolder(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {
            let folder = await Folder.findOne({
                _id: request.body.delete_id
            })
            if(folder && folder.photos && folder.photos.length)
            {
                let params = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Delete: {
                        Objects: []
                    }
                }
                for (let i = 0; i < folder.photos.length; i++) {
                    params.Delete.Objects.push({
                        Key: folder.photos[i].path
                    })
                }
                //console.log("params", params, params.Delete.Objects)
                aws.config.update({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
                })

                const s3 = new aws.S3()
                s3.deleteObjects(params, function(err, deleteData) {
                    if(err)
                    {
                        Sentry.captureException(err)
                    }
                    //console.log("err", err)
                    //console.log("data", deleteData)
                })

                //console.log(deleteResponse)
            }

            await Folder.deleteOne({
                _id: request.body.delete_id
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
     * delete single photo
     */
    async deleteSinglePhoto(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {

            let folder = await Folder.findOne({
                _id: request.body.folder_id
            })

            let photo = folder.photos.find(obj => obj._id == request.body.photo_id)

            await Folder.updateOne({
                _id: request.body.folder_id
            }, {
                "$pull": {
                    "photos": { _id: request.body.photo_id }
                }
            })

            await HelperManager.deleteS3Object(photo.path, photo.name)

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
     * add photo to slideshow
     */
    async addToSlideshowSinglePhoto(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {

            let folder = await Folder.findOne({
                _id: request.body.folder_id
            })

            let photo = folder.photos.find(obj => obj._id == request.body.photo_id)

            //get Slideshow folder
            let slideshowFolder = await Folder.findOne({
                userId: folder.userId,
                name: "Slideshow"
            })

            aws.config.update({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
            })
            const s3 = new aws.S3()

            let bucket = process.env.AWS_S3_BUCKET
            let source_name = photo.path
            let new_source_name = photo.path.replace(folder.id, slideshowFolder.id)

            //check if item is already exists in slideshowFolder
            let existInSlideshowFolder = slideshowFolder.photos.find(obj => obj.path == new_source_name)

            if(!existInSlideshowFolder)
            {
                let copyParams = {
                    Bucket: bucket,
                    CopySource: bucket + "/" +source_name,
                    Key: new_source_name
                }

                await s3.copyObject(copyParams).promise()

                let order = slideshowFolder.photos.length

                slideshowFolder.photos.push({
                    name: photo.name,
                    path: new_source_name,
                    mimetype: photo.mimetype,
                    order: order + 1
                })

                await slideshowFolder.save()

                data.status = true
                data.data = slideshowFolder
                data.message = "success"
                response.send(data)
                return
            }

            data.status = true
            data.data = folder
            data.message = "already_exists"
            response.send(data)
            return
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
            //check if screensaver folder exists, if not create one
            const folder = await Folder.findOne({
                name: "Slideshow",
                userId: request.body.id
            })
            //console.log("folders", folder)
            if(!folder)
            {
                await Folder.create({
                    name: "Slideshow",
                    userId: request.body.id,
                    order: 0,
                    createdBy: request.decoded.id
                })
            }


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
        let data = {
            status: false,
            data: null,
            message: "failed"
        }
        //console.log(request.body)
        var url = require('url')

        let avatar = request.files.avatar
        let filename = avatar.name
        let mimetype = avatar.mimetype

        //console.log("buffer data" + request.files.avatar.data)

        aws.config.update({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
        })

        //get all files

        const s3 = new aws.S3()
        //let uniqid = await HelperManager.uniqid()
        //filename = uniqid + "-" + filename
        let bucket = process.env.AWS_S3_BUCKET
        let bucket_path = request.body.id + "/photos/"+ request.body.folderId +"/"+filename


        try {
            let order = 1

            let folder = await Folder.findOne({
                _id: request.body.folderId
            })

            if(folder.photos && folder.photos.length)
            {
                order = folder.photos.length
            }


            const s3data_exists = await s3.headObject({
                Bucket: bucket,
                Key: bucket_path
            }).promise();
            //console.log(s3data_exists)

            //rename filename
            let uniqid = await HelperManager.uniqid()
            filename = uniqid + "-" + filename
            bucket_path = request.body.id + "/photos/"+filename

            const s3res = await s3.upload({
                Bucket: bucket,
                Key: bucket_path,
                Body: request.files.avatar.data,
                ACL: "private"
            }).promise()

            //add to database

            folder.photos.push({
                name: filename,
                path: bucket_path,
                mimetype: mimetype,
                order: order + 1
            })
            console.log("order", {
                name: filename,
                path: bucket_path,
                mimetype: mimetype,
                order: order + 1
            })
            await folder.save()
            //end add to database


            response.status(200).send({
                status: true,
                data: folder,
                message: 'success'
            })

            //console.log("Image already exists")
            /*Sentry.captureException("Image already exists")

            data.status = false
            data.data = null
            data.message = "failed"
            response.status(403).send(data)*/
        }
        catch (e) {
            //console.log("catch error:::::::::::", e)
            if(e.code === "NotFound")
            {
                const s3res = await s3.upload({
                    Bucket: bucket,
                    Key: bucket_path,
                    Body: request.files.avatar.data,
                    ACL: "private"
                }).promise()

                let order = 1
                //add to database
                let folder = await Folder.findOne({
                    _id: request.body.folderId
                })

                if(folder.photos && folder.photos.length)
                {
                    order = folder.photos.length
                }

                folder.photos.push({
                    name: filename,
                    path: bucket_path,
                    mimetype: mimetype,
                    order: order + 1
                })
                await folder.save()
                //end add to database

                response.status(200).send({
                    status: true,
                    data: folder,
                    message: 'success'
                })
            }
            else {
                console.log(e)
                Sentry.captureException(e)

                data.status = false
                data.data = null
                data.message = "failed"
                response.status(403).send(data)
            }

        }






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
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: request.body.photo.path,
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
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: request.body.photo.path
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
     * update folders photos order
     */
    async updateFoldersPhotosOrder(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            let requestPhotos = request.body.photos
            let folder = await Folder.findOne({
                _id: request.body.folder_id
            })

            folder.photos.forEach(function(obj) {
                let photo = requestPhotos.find(innerObj => innerObj._id == obj._id)
                //console.log("photo", photo)
                obj.order = photo.order
            })
            await folder.save()

            //requestFolders.forEach((folder))
            /*for (const folder of requestFolders) {
                await Folder.findOneAndUpdate({
                    _id: folder.id
                }, {
                    order: folder.order
                })
            }*/
            //let folders = await Folder.collection.insertMany(requestFolders)

            data.status = true
            data.data = folder
            data.message = 'success'

            response.send(data)
        }
        catch (err)
        {
            console.log(err)
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
            let emails = []
            for (let i = 0; i < request.body.email.length; i++)
            {
                if(request.body.email[i] && request.body.email[i] != "")
                {
                    emails.push(request.body.email[i])
                }
            }

            // Remove header
            //let base64Image = base64String.split(';base64,').pop()

            //console.log("body", request.body)
            let createObject = {
                userId: request.body.id,
                contactName: request.body.name,
                skypeId: request.body.skypeid,
                zoomMeetingURL: request.body.zoom_meeting_url,
                notes: request.body.notes,
                email: emails,
                //avatarPath: bucket_path,
                //avatarMIME: mimetype,
                //avatarName: filename,
                createdBy: request.decoded.id
            }

            if(request.body.image_changed)
            {
                aws.config.update({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
                })
                const s3 = new aws.S3()

                let uniqid = await HelperManager.uniqid()
                let string = request.body.avatar

                let mimetype = string.substring(string.indexOf(":")+1, string.indexOf(";"))

                let regex = /^data:.+\/(.+);base64,(.*)$/;

                let matches = string.match(regex);

                //console.log("mimetype", mimetype)
                let ext = matches[1];
                let data1 = matches[2];
                let buffer = Buffer.from(data1, 'base64');

                let filename = uniqid+"."+ext
                let bucket = process.env.AWS_S3_BUCKET
                let bucket_path = request.body.id + "/addressBook/"+filename
                const s3res = await s3.upload({
                    Bucket: bucket,
                    Key: bucket_path,
                    Body: buffer,
                    ACL: "private"
                }).promise()

                createObject.avatarPath = bucket_path
                createObject.avatarMIME = mimetype
                createObject.avatarName = filename

            }

            let address_book = await AddressBook.create(createObject)

            for (let i = 0; i < request.body.phoneNumber.length; i++)
            {
                if(request.body.phoneNumber[i].number)
                {
                    address_book.phoneNumber.push({
                        number: request.body.phoneNumber[i].number,
                        type: request.body.phoneNumber[i].type,
                        carrier: request.body.phoneNumber[i].carrier
                    })
                }

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
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: contact.avatarPath
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
            //console.log("body", request.body)
            //get address book contact
            let contact = await AddressBook.findOne({
                _id: request.body.edit_id
            })

            let emails = []
            for (let i = 0; i < request.body.email.length; i++)
            {
                if(request.body.email[i] && request.body.email[i] != "")
                {
                    emails.push(request.body.email[i])
                }
            }

            let update_data = {
                contactName: request.body.name,
                skypeId: request.body.skypeid,
                zoomMeetingURL: request.body.zoom_meeting_url,
                notes: request.body.notes,
                email: emails
            }
            //console.log("body", request.body)
            if(request.body.image_changed)
            {
                //delete old image
                if(contact.avatarName && contact.avatarMIME && contact.avatarPath)
                {
                    await HelperManager.deleteS3Object(contact.avatarPath, contact.avatarName)
                    /*aws.config.update({
                        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
                    })
                    const s3 = new aws.S3()

                    let deleted_data = await s3.deleteObject({
                        Bucket: contact.avatarPath,
                        Key: contact.avatarName
                    }).promise()*/
                }

                //add new image
                aws.config.update({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
                })
                const s3 = new aws.S3()

                let uniqid = await HelperManager.uniqid()
                let string = request.body.avatar

                let mimetype = string.substring(string.indexOf(":")+1, string.indexOf(";"))

                let regex = /^data:.+\/(.+);base64,(.*)$/;

                let matches = string.match(regex);

                //console.log("mimetype", mimetype)
                let ext = matches[1];
                let data1 = matches[2];
                let buffer = Buffer.from(data1, 'base64');

                let filename = uniqid+"."+ext
                let bucket = process.env.AWS_S3_BUCKET
                let bucket_path = request.body.id + "/addressBook/"+filename
                const s3res = await s3.upload({
                    Bucket: bucket,
                    Key: bucket_path,
                    Body: buffer,
                    ACL: "private"
                }).promise()

                update_data.avatarPath = bucket_path
                update_data.avatarMIME = mimetype
                update_data.avatarName = filename


                /*let string = request.body.avatar
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
                update_data.avatarMIME = request.body.avatarMIME*/
            }

            await AddressBook.findOneAndUpdate({
                _id: request.body.edit_id
            }, update_data)

            await AddressBook.updateOne({
                _id: request.body.edit_id
            }, {
                $set: {phoneNumber: []}
            })

            let address_book = await AddressBook.findOne({
                _id: request.body.edit_id
            })

            for (let i = 0; i < request.body.phoneNumber.length; i++)
            {
                if(request.body.phoneNumber[i].number)
                {
                    address_book.phoneNumber.push({
                        number: request.body.phoneNumber[i].number,
                        type: request.body.phoneNumber[i].type,
                        carrier: request.body.phoneNumber[i].carrier
                    })
                }

            }

            address_book.save()

            let updated_contact = await AddressBook.findOne({
                _id: request.body.edit_id
            })

            data.status = true
            data.data = updated_contact
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

    /**
     * test incoming mail
     */
    async testIncomingMail(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {

            var Imap = require('imap')
            var inspect = require('util').inspect;

            var imap = new Imap({
                user: request.body.imap_username,
                password: request.body.imap_password,
                host: request.body.imap_host,
                port: 993,
                tls: true
            });

            function openInbox(cb) {
                imap.openBox('INBOX', true, cb);
            }

            imap.once('ready', function() {
                openInbox(function(err, box) {
                    if (err) throw err;
                    var f = imap.seq.fetch('1:3', {
                        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                        struct: true
                    });
                    f.on('message', function(msg, seqno) {
                        console.log('Message #%d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', function(stream, info) {
                            var buffer = '';
                            stream.on('data', function(chunk) {
                                buffer += chunk.toString('utf8');
                            });
                            stream.once('end', function() {
                                console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                            });
                        });
                        msg.once('attributes', function(attrs) {
                            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                        });
                        msg.once('end', function() {
                            console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function(err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function() {
                        console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });

            imap.once('error', function(err) {
                console.log(err);
            });

            imap.once('end', function() {
                console.log('Connection ended');
            });

            imap.connect();


            data.status = true
            data.data = null
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

    /** save general settings of user **/
    async userProfileSaveGeneralSettings(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let user = await User.findOne({
                _id: request.body.id
            })
            if(!user.settings)
            {
                user.settings = {}
            }
            user.settings.screenSaverStartAfter = request.body.screenSaverStartAfter
            user.settings.screenSaverPhotoTransitionPeriod = request.body.screenSaverPhotoTransitionPeriod
            await user.save()

            data.status = true
            data.data = user
            data.message = "success"

            response.send(data)
        }
        catch (err)
        {
            console.log(err)
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