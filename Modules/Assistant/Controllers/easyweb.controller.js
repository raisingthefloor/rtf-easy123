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
const {EasyWeb} = require('../../Auth/Models/easyweb.model')
//const {captureWebsite} = require('capture-website')
var getFavicons = require('get-website-favicon')
const aws = require("aws-sdk")
const HelperManager = require("../../../Managers/HelperManager")
const Sentry = require("@sentry/node")


class EasyWebController {
    /**
     * add folder
     */
    async addFolder(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            let allWebsiteAndFolder = await EasyWeb.find({
                deleted: false
            })
            let order = allWebsiteAndFolder.length
            let easyweb = await EasyWeb.create({
                type: 'folder',
                name: request.body.folder_name,
                createdBy: request.decoded.id,
                userId: request.body.id,
                order: order+1
            })

            data.status = true
            data.data = easyweb
            data.message = "success"
            response.send(data)
        }
        catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.message = "failed"

            response.send(data)
        }
    }

    /**
     * update folder
     */
    async updateFolder(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {
            await EasyWeb.updateOne({
                    _id: request.body.edit_id
                },
                {
                name: request.body.folder_name
            })

            let allWebsiteAndFolder = await EasyWeb.find({
                deleted: false
            })

            data.status = true
            data.data = allWebsiteAndFolder
            data.message = "success"
            response.send(data)
        }
        catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.message = "failed"

            response.send(data)
        }
    }

    /**
     * upload temp image for website
     */
    async uploadImage(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {

            let uniqid = await HelperManager.uniqid()
            let avatar = request.files.avatar
            let filename = avatar.name
            let mimetype = avatar.mimetype

            aws.config.update({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
            })
            const s3 = new aws.S3()

            filename = uniqid + "-" + filename

            let bucket_path = process.env.AWS_S3_BUCKET + "/" + request.body.id + "/easyweb"
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

            data.status = true
            data.data = {
                imageFileName: filename,
                imagePath: bucket_path,
                imageMimeType: mimetype
            }
            data.message = "success"
            response.send(data)
            /*response.status(200).send({
                status: true,
                data: {'/uploads/'+filename},
                message: 'success'
            })*/

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
                        data: '/uploads/'+filename,
                        message: 'success'
                    })
                }
            })*/
        }
        catch (err)
        {
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
        }
    }

    /**
     * add website
     */
    async addWebsite(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let website
            let order = 1
            let allWebsiteAndFolders = await EasyWeb.find({
                deleted: false
            })
            //console.log("data", request.body)
            order = allWebsiteAndFolders.length
            let newWebsite = {
                type: "website",
                name: request.body.text_to_put_on_button,
                link: request.body.website_url,
                image: request.body.website_image,
                imageFileName: request.body.websiteImageFileName,
                imageMimeType: request.body.websiteImageMimeType,
                imagePath: request.body.websiteImagePath,
                order: order+1,
                userId: request.body.id,
                createdBy: request.decoded.id
            }
            if(!request.body.websiteImageFileName && request.body.website_sample_image_url)
            {
                newWebsite.imageType = "favcon"
                newWebsite.image = request.body.website_sample_image_url
            }
            else {
                newWebsite.imageType = "uploaded"
            }
            if(request.body.selected_folder.id)
            {
                let folder = await EasyWeb.findById(request.body.selected_folder.id)
                //console.log("folder", folder)
                let folder_websites_order = 1
                folder_websites_order = folder.websites.length
                newWebsite.order = folder_websites_order
                folder.websites.push(newWebsite)
                let folder_list = await folder.save()
                //console.log("now", folder)
                data.status = true
                data.data = folder_list
                data.message = "success"
                response.send(data)
            }
            else {
                website = await EasyWeb.create(newWebsite)

                data.status = true
                data.data = website
                data.message = "success"
                response.send(data)
            }




        }
        catch (err)
        {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.message = "failed"
            response.send(data)
        }
    }

    /**
     * get all websites and folders
     */
    async getWebsitesAndFolders(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let websitesAndFolders = await EasyWeb.find({
                deleted: false,
                userId: request.body.id
            })

            data.status = true
            data.data = websitesAndFolders
            data.message = "success"
            response.send(data)
        }
        catch (err)
        {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.message = "failed"
            response.send(data)
        }
    }

    /**
     * change order of websites and folders
     */
    async changeOrderOfWebsitesAndFolders(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let websitesAndFolders = request.body.website_and_folders

            for (const object of websitesAndFolders) {
                await EasyWeb.findOneAndUpdate({
                    _id: object.id
                }, {
                    order: object.order
                })
            }

            let allWebsitesAndFolders = await EasyWeb.find({
                deleted: false
            })

            data.status = true
            data.data = allWebsitesAndFolders
            data.message = 'success'
        }
        catch (err)
        {
            console.log(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
        }
    }

    /**
     * get website snapshot from the URL
     */
    async getWebsiteSnapshotFromURL(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let data1 = await getFavicons(request.body.website_url)
            let fav_url = null
            //console.log(data)
            if(data1.icons.length)
            {
                fav_url = data1.icons[0].src
            }

            data.status = true
            data.data = fav_url
            data.message = "success"

            response.send(data)
        }
        catch (err)
        {
            console.log(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
        }
        //let captureWebsite = require('capture-website')
        //let image = await captureWebsite.file('https://sindresorhus.com', 'screenshot.png');


    }

    /**
     * delete website or folder
     */
    async deleteWebsiteOrFolder(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            if(request.body.parent_id)
            {
                //find one
                /*let parentEasyWebItem = await EasyWeb.findOne({_id:request.body.parent_id}).exec()

                parentEasyWebItem.findByIdAndUpdate(this.parent_id, {
                    $pull: {
                        websites: {id: request.body.id}
                    }
                })
                //soft delete
                parentEasyWebItem = await parentEasyWebItem.save()*/
                /*let parentEasyWebItem = await EasyWeb.updateOne({
                    id: request.body.parent_id
                }, {
                    $pull: {
                        websites: {id: request.body.id}
                    }
                })
                await parentEasyWebItem.save()*/

                let parentEasyWebItem = await EasyWeb.findOne({_id:request.body.parent_id}).exec()
                await parentEasyWebItem.websites.pull({_id: request.body.item_id})
                parentEasyWebItem = await parentEasyWebItem.save()

                data.status = true
                data.data = parentEasyWebItem
                data.message = 'success'

                response.send(data)
            }
            else
            {
                //find one
                let easyWebItem = await EasyWeb.findOne({_id:request.body.item_id}).exec()

                //soft delete
                easyWebItem = await easyWebItem.softdelete()

                data.status = true
                data.data = easyWebItem
                data.message = 'success'

                response.send(data)
            }



        }
        catch (err)
        {
            console.log(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
        }


    }

    /**
     * website Fav
     */
    async websiteFav(request, response)
    {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let easyweb = await EasyWeb.findOneAndUpdate({
                _id: request.body.website_id.id
            }, {
                fav: request.body.website_fav
            })

            data.status = true
            data.data = easyweb

            data.message = "success"
            response.send(data)
        }
        catch (err)
        {
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.message = "failed"
            response.send(data)
        }
    }

    /**
     * update website
     */
    async updateWebsite(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try
        {
            let website
            console.log("data", request.body)
            let updateWebsite = {
                name: request.body.text_to_put_on_button,
                link: request.body.website_url,
                image: request.body.website_image,
                imageFileName: request.body.websiteImageFileName,
                imageMimeType: request.body.websiteImageMimeType,
                imagePath: request.body.websiteImagePath
            }
            if(!request.body.websiteImageFileName && request.body.website_sample_image_url)
            {
                updateWebsite.imageType = "favcon"
                updateWebsite.image = request.body.website_sample_image_url
            }
            else {
                updateWebsite.imageType = "uploaded"
            }
            if(request.body.selected_folder && request.body.selected_folder.id)
            {
                let Folder = await EasyWeb.findById(request.body.selected_folder.id)
                //console.log("folder", Folder)

                //folder.websites.push(updateWebsite)

                /*let s = await Folder.find({
                    "websites._id": request.body.edit_id
                })*/
                let s = await EasyWeb.updateOne({
                    "websites": {
                        "$elemMatch": {
                            "_id": request.body.edit_id
                        }
                    }
                }, {
                    "$set": {
                        "websites.$.name": updateWebsite.name,
                        "websites.$.link": updateWebsite.link,
                        "websites.$.image": updateWebsite.image,
                        "websites.$.imageFileName": updateWebsite.imageFileName,
                        "websites.$.imageMimeType": updateWebsite.imageMimeType,
                        "websites.$.imagePath": updateWebsite.imagePath
                    }
                })

                /*await Folder.websites.update({
                    "websites._id": request.body.edit_id
                }, {
                    "$set": {
                        "websites.$.name": updateWebsite.name
                    }
                })*/
                //await Folder.save()

                let allEasyWebs = await EasyWeb.find({
                    deleted: false
                })
                //console.log("now", folder)
                data.status = true
                data.data = allEasyWebs
                data.message = "success"
                response.send(data)
            }
            else {
                website = await EasyWeb.updateOne({
                    _id: request.body.edit_id
                }, updateWebsite)

                let allEasyWebs = await EasyWeb.find({
                    deleted: false
                })

                data.status = true
                data.data = allEasyWebs
                data.message = "success"
                response.send(data)
            }




        }
        catch (err)
        {
            console.log(err)
            logger.error('Error::' + err)
            Sentry.captureException(err)

            data.message = "failed"
            response.send(data)
        }
    }
}

module.exports = new EasyWebController()