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
const HelperManager = require("../../../Managers/HelperManager")
const Sentry = require("@sentry/node")
const aws = require("aws-sdk")

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
            let user = await HelperManager.getLoggedInUser(request.decoded)

            let folders = await Folder.find({
                userId: user.id
            }).sort({order:1})

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

}

module.exports = new UserController()