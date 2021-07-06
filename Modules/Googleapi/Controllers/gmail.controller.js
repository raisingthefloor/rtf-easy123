const logger = require('../../../logger/api.logger')
const {google} = require('googleapis')
const GoogleManager =  require("../../../Managers/GoogleManager");
const UserManager =  require("../../../Managers/UserManager");
const {User} = require('../Models/user.model')
const {Token} = require('../Models/token.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

class GmailController {

    SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

    async connect(request, response) {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        //const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, process.env.GOOGLE_REDIRECT_URI)

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        })
        return response.redirect(authUrl)
    }
    async apiConnect(request, response) {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        //const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, process.env.GOOGLE_REDIRECT_URI)

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        })

        response.send({
            status: true,
            data: {url: authUrl}
        })
        //return response.redirect(authUrl)
    }

    async googleCallback(request, response) {
        //console.log("code", request.query.code)
        const token = await GoogleManager.getToken(request.query.code)

        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0])
        oAuth2Client.setCredentials(token)

        //get user profile
        const userProfile = await GoogleManager.getUserProfile(oAuth2Client)
        //console.log("userProfile", userProfile)

        let data
        try {
            //check user exists with email
            const users = await User.find({email: userProfile.emailAddress});
            if(users.length)
            {
                return response.redirect(process.env.FRONT_URL)
            }

            //store the token in the database
            data = await User.create({
                email: userProfile.emailAddress,
                google_authentication_code: JSON.stringify(token)
            });
            return response.redirect(process.env.FRONT_URL + "#/new-user/"+data.id)
            //console.log("user data", data)
        } catch (err) {
            //console.log("error while inserting ", err)
            logger.error('Error::' + err)
        }
    }

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

        let data
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
            /*data = await User.create({
                email: userProfile.emailAddress,
                google_authentication_code: JSON.stringify(token)
            });*/

            response.send({
                status: true,
                data: { email: current_user.googleEmail },
                message: 'success'
            })
            return
            //return response.redirect(process.env.FRONT_URL + "#/new-user/"+data.id)
            //console.log("user data", data)
        } catch (err) {
            console.log(err)
            response.send({
                status: false,
                data: {}
            })
            return
            //console.log("error while inserting ", err)
            //logger.error('Error::' + err)
        }
    }

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

            //console.log('users:::', users);
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
            let allUnreadMails = await GoogleManager.getUnreadMessages(oAuth2Client)
            let allUnreadMailDetails = []
            //console.log("allUnreadMails", allUnreadMails)
            for (let mail of allUnreadMails)
            {
                let mail_detail = await GoogleManager.getSingleProcessedMessageDetails(oAuth2Client, mail)

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
                allUnreadMailDetails.push(mail_detail)
            }
            oAuth2Client.expressResponse.send(allUnreadMailDetails)



        } catch (err) {
            logger.error('Error::' + err, err.stackTrace);
        }



        //this.authorize(JSON.parse(process.env.GOOGLE_CREDENTIALS), request, response, this.listUnreadMessages)
    }

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
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(credentials, expressRequest, expressResponse, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0])

        if(!expressRequest.body.id)
        {
            expressResponse.send({"error": true, "data":[], "message": "User is not logged in"})
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
    deleteOldData(request, response) {
        let data = {"status": false}
        try {
            User.deleteMany({}, function (err) {
                if (err) return handleError(err);
                // deleted at most one tank document
                data = {"status": true}
            })
        } catch (err) {
            logger.error('Error::' + err)
        }

        response.send(data)
    }


}

module.exports = new GmailController();