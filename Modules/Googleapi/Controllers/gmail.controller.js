const logger = require('../../../logger/api.logger');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const GoogleManager =  require("../../../Managers/GoogleManager");
const {User} = require('../Models/user.model')
//const toBlobURL = require('stream-to-blob-url')

class GmailController {

    TOKEN_PATH = __dirname+'/config/token/new.txt'
    SCOPES = ['https://www.googleapis.com/auth/gmail.modify','https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.modify']

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
            //check user exists with email
            const users = await User.find({email: userProfile.emailAddress});
            if(users.length)
            {
                response.send({
                    status: false,
                    data: {id: process.env.FRONT_URL}
                })
                return
                //return response.redirect(process.env.FRONT_URL)
            }

            //store the token in the database
            data = await User.create({
                email: userProfile.emailAddress,
                google_authentication_code: JSON.stringify(token)
            });
            response.send({
                status: true,
                data: {id: data.id}
            })
            return
            //return response.redirect(process.env.FRONT_URL + "#/new-user/"+data.id)
            //console.log("user data", data)
        } catch (err) {
            response.send({
                status: false,
                data: {}
            })
            return
            //console.log("error while inserting ", err)
            logger.error('Error::' + err)
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

    async login( request, response) {
        try {
            const users = await User.find({
                email: request.body.email,
                password: request.body.password
            });
            //console.log('users:::', users);
            response.send(users);
        } catch (err) {
            logger.error('Error::' + err);
        }
    }

    async getAllMails(request, response) {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        if(!request.body.user_id)
        {
            response.send({"error": true, "data":[], "message": "User is not logged in"})
            return
        }

        //get user from db
        try {
            let user = await User.find({
                _id: request.body.user_id
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
            logger.error('Error::' + err);
        }



        //this.authorize(JSON.parse(process.env.GOOGLE_CREDENTIALS), request, response, this.listUnreadMessages)
    }

    async replyMail(request, response) {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        if(!request.body.user_id)
        {
            response.send({"error": true, "data":[], "message": "User is not logged in"})
            return
        }

        //get user from db
        try {
            let user = await User.find({
                _id: request.body.user_id
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

            let raw = this.createMessage('myrealemail@gmail.com', request.body.from, request.body.subject, request.body.message, oAuth2Client.expressRequest.body)
            const mail_sent = await GoogleManager.sendMail(oAuth2Client, raw)
        } catch (err) {
            logger.error('Error::' + err);
        }






        /*//response.send([request.body])
        // Load client secrets from a local file.
        fs.readFile(`${__dirname}/credentials.json`, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            //this.authorize(JSON.parse(content), this.listLabels);
            this.authorize(JSON.parse(content), request, response, this.sendMessage);
        });*/
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

        /*//get user from db
        try {
            let user = await User.find({
                id: request.body.id
            });
            //console.log('users:::', users);
            if(!user.length)
            {
                expressResponse.send({"error": true, "data":[], "message": "User is not logged in"})
            }
            user = user[0]

            oAuth2Client.setCredentials(JSON.parse(user.google_authentication_code))
            oAuth2Client.expressResponse = expressResponse
            oAuth2Client.expressRequest = expressRequest
            oAuth2Client.currentClassPointer = this
            return callback(oAuth2Client)
        } catch (err) {
            logger.error('Error::' + err);
        }*/

        /*// Check if we have previously stored a token.
        fs.readFile(this.TOKEN_PATH, (err, token) => {
            if (err) return this.getNewToken(oAuth2Client, expressRequest, expressResponse, callback);




            oAuth2Client.setCredentials(JSON.parse(token));
            oAuth2Client.expressResponse = expressResponse;
            oAuth2Client.expressRequest = expressRequest;
            oAuth2Client.currentClassPointer = this;

            return callback(oAuth2Client)
        });*/
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    async getNewToken(oAuth2Client, expressRequest, expressResponse, callback) {
        //console.log("getNewToken Running ...")
        var self = this
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        return expressResponse.redirect(authUrl);


        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(self.TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', self.TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    /**
     * Lists the labels in the user's account.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    async listLabels(auth) {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.labels.list({
            userId: 'me',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const labels = res.data.labels;
            if (labels.length) {
                console.log('Labels:');
                labels.forEach((label) => {
                    console.log(`- ${label.name}`);
                });
            } else {
                console.log('No labels found.');
            }
        });
    }

    /**
     * Lists the unread messages in the user's account.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    async listUnreadMessages(auth) {
        console.log("listUnreadMessages")
        const gmail = google.gmail({version: 'v1', auth})
        let allUnreadMails = await GoogleManager.getUnreadMessages(auth)
        let allUnreadMailDetails = []
        for (let mail of allUnreadMails)
        {
            let mail_detail = await GoogleManager.getSingleProcessedMessageDetails(auth, mail)

            let messageId = mail_detail.payload.headers.find(obj => obj.name == "Message-ID")
            if(mail_detail.decoded_attachments && mail_detail.decoded_attachments.length)
            {
                let i = 0
                for (let attachment of mail_detail.decoded_attachments)
                {
                    let attachment_data = await GoogleManager.attachmentData(auth, messageId, attachment)
                    mail_detail.decoded_attachments[i].attachment_data = attachment_data
                    i++
                }
            }
            allUnreadMailDetails.push(mail_detail)
        }
        auth.expressResponse.send(allUnreadMailDetails)
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
        console.log("modified_to", modified_to)
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


}

module.exports = new GmailController();