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
            })

            /*aws.config.update({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                signatureVersion: 'v4',
                region: 'us-east-2'
            })

            for (let i = 0; i < folders.length; i++)
            {
                if (folders[i].photos && folders[i].photos.length)
                {
                    for (let j = 0; j < folders[i].photos.length; j++)
                    {
                        const s3 = new aws.S3()

                        const s3data =  await s3.getSignedUrl('getObject',
                            {
                                Bucket: process.env.AWS_S3_BUCKET,
                                Key: folders[i].photos[j].path,
                                Expires: 60*5
                            }
                        )

                        folders[i].photos[j].imageData = s3data
                        console.log("\n\ns3data", s3data, folders[i].photos[j])
                    }
                }
            }
            console.log("photos", folders[0].photos)*/

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
                        Expires: 60*5
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
}

module.exports = new UserController()