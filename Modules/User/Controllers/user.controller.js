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
const {EasyWeb} = require("../../Auth/Models/easyweb.model")
const {Call} = require("../../Auth/Models/call.model")
const {User} = require("../../Auth/Models/user.model")
const HelperManager = require("../../../Managers/HelperManager")
const Sentry = require("@sentry/node")
const aws = require("aws-sdk")
const nodeMailJet = require('node-mailjet')

class UserController {
    /** get folders **/
    async getFolders(request, response) {
        let data = {
            status: false,
            data: null,
            message: ""
        }
        
        try
        {
            //console.log("decoded", request.decoded)
            let user = await HelperManager.getLoggedInUser(request.decoded)
            //console.log("user", user)
            let folders = await Folder.find({
                userId: user.id,
                photos: { $exists: true, $not: { $size: 0 } }
            }).sort({order:1})
            //console.log("folders", folders)

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

    /** get photos **/
    async getFolderPhotos(request, response) {
        let data = {
            status: false,
            data: null,
            message: ""
        }

        try
        {
            //let user = await HelperManager.getLoggedInUser(request.decoded)
            let photos = []
            let folder = await Folder.findOne({
                _id: request.body.folder_id
            })

            aws.config.update({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                signatureVersion: 'v4',
                region: 'us-east-2'
            })

            for (let i = 0; i < folder.photos.length; i++)
            {
                const s3 = new aws.S3()

                const s3data =  await s3.getSignedUrl('getObject',
                    {
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: folder.photos[i].path,
                        Expires: 60*60*5
                    }
                )

                photos.push(s3data)
            }

            data.status = true
            data.data = photos
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

    /** get easyweb data **/
    async getEasywebData(request, response) {
        let data = {
            status: false,
            data: null,
            message: ""
        }

        try
        {
            let user = await HelperManager.getLoggedInUser(request.decoded)

            let easywebs = await EasyWeb.find({
                userId: user.id,
                deleted: false
            })
            //console.log(easywebs)

            data.status = true
            data.data = easywebs
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

    /** change easyweb fav **/
    async changeFav(request, response) {
        let data = {
            status: false,
            data: null,
            message: ""
        }

        try
        {
            //console.log(request.body)
            if(request.body.type == "fav")
            {
                let easyweb = await EasyWeb.updateOne({
                    _id: request.body.item_id
                }, {
                    fav: false
                })

                data.status = true
                data.data = easyweb
                data.message = "success"
                response.send(data)
            }
            else if (request.body.type == "add")
            {
                let easyweb = await EasyWeb.updateOne({
                    _id: request.body.item_id
                }, {
                    fav: true
                })

                data.status = true
                data.data = easyweb
                data.message = "success"
                response.send(data)
            }
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

    /** get user general settings **/
    async getUserGeneralSettings(request, response)
    {
        let data = {
            status: false,
            data: null,
            message: ""
        }

        try {
            let user = await HelperManager.getLoggedInUser(request.decoded)

            data.status = true
            data.data = user
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

    /** make a call **/
    async makeACall(request, response)
    {
        let data = {
            status: false,
            data: null,
            message: ""
        }

        try {
            let user = await HelperManager.getLoggedInUser(request.decoded)

            if(!user) {
                data.status = false
                data.data = null
                data.message = "failed"
                response.send(data)
                return
            }

            //create a call
            let call = await Call.create({
                createdBy: user.id
            })

            let link = "call/"+call.id
            call.link = link


            //send a mail to contact's mail addresses
            call.invitationSentTo = request.body.contact.email
            await call.save()

            const mailjet = nodeMailJet.connect(
                process.env.MJ_APIKEY_PUBLIC,
                process.env.MJ_APIKEY_PRIVATE
            )

            if(request.body.contact.email.length)
            {
                for (let i = 0; i < request.body.contact.email.length; i++)
                {
                    //send mail mailjet
                    const mailRequest = mailjet.post('send', { version: 'v3.1' }).request({
                        Messages: [
                            {
                                From: {
                                    Email: process.env.MJ_SENDER_EMAIL,
                                    Name: process.env.MJ_SENDER_NAME,
                                },
                                To: [
                                    {
                                        Email: request.body.contact.email[i],
                                        Name: request.body.contact.contactName,
                                    },
                                ],
                                Subject: 'Call from '+user.name,
                                //TextPart: 'Greetings from Mailjet!',
                                HTMLPart: 'Hello '+ request.body.contact.contactName + ',<br><br>' + 'You have a call from '+ user.name +', please join the call by clicking on the link : <a href="'+process.env.FRONT_URL+link+'?email='+request.body.contact.email[i]+'">Join Call</a><br><br>Thank You!<br>Easy123 Team'
                            },
                        ],
                    })

                    mailRequest
                        .then(result => {
                            //console.log(result.body)
                        })
                        .catch(err => {
                            Sentry.captureException(err)
                            console.log(err.statusCode)
                        })
                }
            }



            //console.log(request.body.contact)

            data.status = true
            data.data = {
                call:call,
                callLink: link+"?email="+user.email
            }
            data.message = "success"
            response.send(data)
            return
        }
        catch (err)
        {
            console.log(err)
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
            return
        }
    }

    /** get a call data **/
    async getCallData(request, response)
    {
        let data = {
            status: false,
            data: null,
            message: ""
        }

        try {
            /*let user = await HelperManager.getLoggedInUser(request.decoded)

            if(!user) {
                data.status = false
                data.data = null
                data.message = "failed"
                response.send(data)
                return
            }*/

            //get a call
            let call = await Call.findOne({
                _id: request.body.call
            })

            if(!call)
            {
                data.status = false
                data.data = null
                data.message = "failed"
                response.send(data)
                return
            }

            let createdBy = await User.findOne({
                _id: call.createdBy
            })

            if(createdBy.email == request.body.email || call.invitationSentTo.includes(request.body.email))
            {
                data.status = true
                data.data = {
                    call: call,
                    createdBy: createdBy
                }
                data.message = "success"
                response.send(data)
                return
            }
            else
            {
                data.status = false
                data.data = null
                data.message = "not_a_valid_link"
                response.send(data)
                return
            }


        }
        catch (err)
        {
            console.log(err)
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
            return
        }
    }
}

module.exports = new UserController()