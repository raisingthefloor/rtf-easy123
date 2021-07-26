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
const {google} = require('googleapis')
const GoogleManager =  require("../../../Managers/GoogleManager")
const {User} = require('../Models/user.model')

class GmailController {

    SCOPES = ['https://www.googleapis.com/auth/gmail.modify', 'https://mail.google.com/']

    /**
     * api for getting connect URL
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async apiConnect(request, response) {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        //const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, process.env.GOOGLE_REDIRECT_URI)

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
            prompt: 'consent'
        })

        response.send({
            status: true,
            data: {url: authUrl}
        })
        //return response.redirect(authUrl)
    }

    /**
     * Handle Google callback for
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async apiGoogleCallback(request, response) {
        //console.log("code", request.body.code)
        const token = await GoogleManager.getToken(request.body.code)

        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, process.env.GOOGLE_REDIRECT_URI)
        oAuth2Client.setCredentials(token)

        //get user profile
        const userProfile = await GoogleManager.getUserProfile(oAuth2Client)
        //console.log("userProfile", userProfile)

        try {
            //get current user data
            let current_user = await User.findOne({_id: request.decoded.id})
            if(!current_user)
            {
                response.send({
                    status: false,
                    data: {id: process.env.FRONT_URL}
                })
                return
            }
            //console.log("current_user", request.decoded, current_user)

            //store the token in the database
            current_user.google_authentication_code = JSON.stringify(token)
            current_user.googleEmail = userProfile.emailAddress
            current_user.save()

            response.send({
                status: true,
                data: { email: current_user.googleEmail },
                message: 'success'
            })
            return
        } catch (err) {
            console.log(err)
            response.send({
                status: false,
                data: {}
            })
            return
        }
    }

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
            logger.error('Error::' + err);
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
        }
        response.send(data)
    }


    /**
     * get all unread mails
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async getAllMails(request, response) {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);


        //get user from db
        try {
            let user = await User.find({
                _id: request.decoded.id
            })

            //console.log('users:::', user);
            if(!user.length)
            {
                response.send({"error": true, "data":[], "message": "User is not logged in"})
                return
            }
            user = user[0]

            oAuth2Client.setCredentials(JSON.parse(user.google_authentication_code))
            oAuth2Client.expressResponse = response
            oAuth2Client.expressRequest = request
            oAuth2Client.currentClassPointer = this


            const gmail = google.gmail({version: 'v1', oAuth2Client})


            //trash all messages demo
            await GoogleManager.trashAllMessagesDemo(oAuth2Client, user)
            //console.log("trashAllMessagesDemo")

            //send 2 demo messages
            await GoogleManager.sendTwoNewEmailsDemo(oAuth2Client, user)
            //console.log("sendTwoNewEmailsDemo")

            let allUnreadMails = await GoogleManager.getUnreadMessages(oAuth2Client)
            //console.log("getUnreadMessages")
            let allUnreadMailDetails = []
            //console.log("allUnreadMails", allUnreadMails)
            for (let mail of allUnreadMails)
            {
                let mail_detail = await GoogleManager.getSingleProcessedMessageDetails(oAuth2Client, mail)
                //console.log("getSingleProcessedMessageDetails", mail_detail)
                let messageId = mail_detail.payload.headers.find(obj => obj.name == "Message-ID")
                if(mail_detail.decoded_attachments && mail_detail.decoded_attachments.length)
                {
                    let i = 0
                    for (let attachment of mail_detail.decoded_attachments)
                    {
                        let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, attachment)
                        mail_detail.decoded_attachments[i].attachment_data = attachment_data
                        i++
                    }
                }

                /*console.log("decoded_related_images", mail_detail.decoded_related_images)
                console.log("datatype ", mail_detail.decoded_related_images, typeof mail_detail.decoded_related_images, Array.isArray(mail_detail.decoded_related_images))*/
                //console.log("decoded_attachments1", mail_detail.decoded_related_images.length)
                /*if (mail_detail.decoded_related_images)
                {
                    for (let attachment of mail_detail.decoded_attachments)
                    {
                        console.log("attachment", attachment)
                        let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, attachment)
                        mail_detail.decoded_related_images[i].attachment_data = attachment_data
                    }
                }*/

                /*for (let j = 0; j < mail_detail.decoded_related_images.length; j++)
                {
                    let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, mail_detail.decoded_related_images[j])
                    mail_detail.decoded_related_images[j].attachment_data = attachment_data
                    mail_detail.decoded_related_images[j].content_id = mail_detail.decoded_related_images[j].headers.find(obj => obj.name == "X-Attachment-Id").value
                    //console.log("now", mail_detail.decoded_related_images[j])
                }*/

                allUnreadMailDetails.push(mail_detail)
            }
            oAuth2Client.expressResponse.send(allUnreadMailDetails)



        } catch (err) {
            logger.error('Error::' + err, err.stackTrace);
        }



        //this.authorize(JSON.parse(process.env.GOOGLE_CREDENTIALS), request, response, this.listUnreadMessages)
    }

    /**
     * reply to existing mail
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async replyMail(request, response) {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        //get user from db
        try {
            let user = await User.find({
                _id: request.decoded.id
            })

            //console.log('users:::', users);
            if(!user.length)
            {
                response.status(401).send({"status": false, "data":[], "message": "User is not logged in"})
                return
            }
            user = user[0]

            oAuth2Client.setCredentials(JSON.parse(user.google_authentication_code))
            oAuth2Client.expressResponse = response
            oAuth2Client.expressRequest = request
            oAuth2Client.currentClassPointer = this

            let raw = this.createMessage('myrealemail@gmail.com', request.body.from, request.body.subject, request.body.message, oAuth2Client.expressRequest.body)
            const mail_sent = await GoogleManager.sendMail(oAuth2Client, raw)
            if(mail_sent && mail_sent.status == 200)
            {
                response.send({"status": true, "data":[], "message": "success"})
                return
            }
            else {
                response.send({"status": false, "data":[], "message": "Reply not sent"})
                return
            }
        } catch (err) {
            logger.error('Error::' + err);
        }

    }


    /**
     * Send a reply to message
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
     sendMessage(auth) {
        let raw = auth.currentClassPointer.createMessage('myrealemail@gmail.com', auth.expressRequest.body.from, auth.expressRequest.body.subject, auth.expressRequest.body.message, auth.expressRequest.body)
        const gmail = google.gmail({version: 'v1', auth})
        gmail.users.messages.send({
            auth: auth,
            userId: 'me',
            resource: {
                raw: raw
            }
        }, function(err, response) {
            if (err) return console.log('The API returned an error: ' + err);
            auth.expressResponse.send(response)
        });
    }

    /**
     * Create a message for an email.
     *
     * @param sender email address of the sender, the mailbox account
     * @param to email address of the receiver
     * @param subject subject of the email
     * @param messageText body text of the email
     * @param requestBody body text of the email
     */
    createMessage(sender, to, subject, messageText, requestBody) {
        //
        let modified_subject = subject
        if(!modified_subject.startsWith('Re: '))
        {
            modified_subject = 'Re: '+modified_subject
        }

        let modified_to = to
        modified_to = modified_to.substring(modified_to.indexOf("<") + 1)
        modified_to = modified_to.substring(0, modified_to.indexOf('>'))
        //console.log("modified_to", modified_to)
        var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
            "MIME-Version: 1.0\n",
            "Content-Transfer-Encoding: 7bit\n",
            "to: ", modified_to, "\n",
            "from: ", sender, "\n"]

        if(requestBody.references && requestBody.references != '')
        {
            str.push("References: ", requestBody.references, "\n")
        }

        str.push("In-Reply-To: ", requestBody.message_id, "\n",
            "subject: ", modified_subject, "\n\n",
            messageText)

        str = str.join('')


        var encodedMail = new Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail;
    }

    /**
     * delete old data of user table
     */
    async deleteOldData(request, response) {
        let data = {"status": false}
        try {
            await User.deleteMany({})
            data.status = true
        } catch (err) {
            logger.error('Error::' + err)
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
            const user = new User({
                role: "admin",
                emailVerified: true,
                name: "Admin",
                email: request.query.email,
                password: "$2b$10$eJskkfqgTVpN2tY37dUkGOYZcdl9J42uVxnp3nx1cWd0Pty2HVpvi",
                createdAt: "2021-06-30T10:11:27.876+00:00",
                updatedAt: "2021-07-15T05:39:15.322+00:00",
                deleted: false,
                deletedAt: null,
                googleEmail: ""
            });
            await user.save()
            data.status = true
        } catch (err) {
            logger.error('Error::' + err)
            data.err = err
        }

        response.send(data)
    }


}

module.exports = new GmailController();