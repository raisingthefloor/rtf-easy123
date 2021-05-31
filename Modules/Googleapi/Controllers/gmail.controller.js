const logger = require('../../../logger/api.logger');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const mimemessage = require('mimemessage');


class GmailController {

    TOKEN_PATH = __dirname+'/config/token/new.txt'
    SCOPES = ['https://www.googleapis.com/auth/gmail.modify','https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.modify']

    async getMails(request, response) {
        //console.log('mails:::', "here", new Date());
        /*let token = {"sa": "sample"}
        fs.writeFile(__dirname+'/config/token/new.txt', JSON.stringify(token), { flag: 'w' }, (err) => {
            if (err) {
                return console.error(err);
            }
            else {
                console.log('Token stored to', this.TOKEN_PATH);
                return console.log('mails:::', "here", new Date())
            }

        });
        return;*/

        //response.send([]);
        // If modifying these scopes, delete token.json.
        //const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        //const TOKEN_PATH = __dirname+'/../../../config/token';

        // Load client secrets from a local file.
        fs.readFile(`${__dirname}/credentials.json`, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            //this.authorize(JSON.parse(content), this.listLabels);
            this.authorize(JSON.parse(content), request, response, this.listLabels);
        });

    }

    async getAllMails(request, response) {

        /*fs.readFile(`${__dirname}/data/unreadmail.txt`, (err, content) => {
            if (err) return console.log('Error loading data from file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            //this.authorize(JSON.parse(content), this.listLabels);

            let content_json = JSON.parse(content)
            content_json.forEach(function (mail, index, content_json) {
                if(mail.payload.body.data)
                {
                    let buff = new Buffer.from(mail.payload.body.data, 'base64');
                    let text = buff.toString('utf8');
                    mail.decoded_body = []
                    mail.decoded_body[0] = text
                }
                if(mail.payload.parts)
                {
                    let buff = new Buffer.from(mail.payload.parts[0].body.data, 'base64');
                    let text = buff.toString('utf8');
                    mail.decoded_parts = []
                    mail.decoded_parts[0] = text
                }

            })
            //console.log(JSON.parse(content))

            //response.send(JSON.parse(content));
            response.send(content_json);
        });*/

        //console.log('mails:::', "here", new Date());

        //response.send([]);
        // If modifying these scopes, delete token.json.
        //const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        //const TOKEN_PATH = __dirname+'/../../../config/token';

        // Load client secrets from a local file.
        fs.readFile(`${__dirname}/credentials.json`, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            //this.authorize(JSON.parse(content), this.listLabels);
            this.authorize(JSON.parse(content), request, response, this.listUnreadMessages);
        });

    }

    async replyMail(request, response) {

        //response.send([request.body])
        // Load client secrets from a local file.
        fs.readFile(`${__dirname}/credentials.json`, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            //this.authorize(JSON.parse(content), this.listLabels);
            this.authorize(JSON.parse(content), request, response, this.sendMessage);
        });
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
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(this.TOKEN_PATH, (err, token) => {
            if (err) return this.getNewToken(oAuth2Client, callback);

            oAuth2Client.setCredentials(JSON.parse(token));
            oAuth2Client.expressResponse = expressResponse;
            oAuth2Client.expressRequest = expressRequest;
            oAuth2Client.currentClassPointer = this;

            return callback(oAuth2Client)
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    async getNewToken(oAuth2Client, callback) {
        console.log("getNewToken Running ...")
        var self = this
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
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
    listUnreadMessages(auth) {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.list({
            userId: 'me',
            labelIds: ['UNREAD','INBOX']
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);

            //get message details
            let formatedResponse = []

            let allMails = res.data.messages
            let counter = 1

            if(allMails.length)
            {
                let allMailsPromise = new Promise((resolve, reject) => {
                    allMails.forEach((element, index) => {

                        gmail.users.messages.get({
                            userId: 'me',
                            id: element.id
                        }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);
                            let mail_data = res.data
                            let mail_data_alternative = {}
                            let headers = mail_data.payload.headers
                            let decoded_attachments = []
                            if(mail_data.payload.mimeType == "multipart/mixed")
                            {
                                let messageId = headers.find(obj => obj.name == "Message-ID")
                                //mail_data_alternative = mail_data.payload.parts
                                mail_data_alternative = mail_data.payload.parts.find(x => x.mimeType == "multipart/alternative")

                                let html_part = mail_data_alternative.parts.find(y => y.mimeType == "text/html")

                                let buff = new Buffer.from(html_part.body.data, 'base64');
                                let text = buff.toString('utf8');
                                mail_data.decoded_parts = []
                                mail_data.decoded_parts[0] = text
                                //const root = parse(html)
                                //console.log("root", root)

                                //console.log("mail_data_alternative, mixed", mail_data_alternative)
                                let attachments = mail_data.payload.parts.filter(obj => obj.mimeType != "multipart/alternative")
                                mail_data.decoded_attachments = attachments
                                /*if(attachments.length)
                                {
                                    let attachment_promise = new Promise((resolve, reject) => {
                                        /!*foo.forEach((value, index, array) => {
                                            console.log(value);
                                            if (index === array.length -1) resolve();
                                        });*!/

                                        attachments.forEach((attachment_element, attachment_index) => {
                                            if(attachment_element.body && attachment_element.body.attachmentId)
                                            {
                                                //get attachment of message
                                                gmail.users.messages.attachments.get({
                                                    userId: 'me',
                                                    messageId: messageId,
                                                    id: attachment_element.body.attachmentId
                                                }, (err, res) => {
                                                    if (err) return console.log('The API returned an error: ' + err);
                                                    let att = attachment_element
                                                    att.data = res.data.data

                                                    decoded_attachments.push(att)
                                                    if (attachment_index === attachments.length -1) resolve()
                                                    //console.log("attachment_element", attachment_element,mail_data.decoded_attachments.length)
                                                })
                                            }

                                        })
                                    });

                                    attachment_promise.then(() => {
                                        //console.log('All done!', decoded_attachments);
                                        mail_data.decoded_attachments = []
                                        mail_data.decoded_attachments = decoded_attachments
                                        console.log("mail_data.decoded_attachments", mail_data)
                                    });





                                }*/
                                //console.log("attachments", attachments)
                            }
                            else if(mail_data.payload.mimeType == "multipart/alternative")
                            {
                                if(mail_data.payload.body.data)
                                {
                                    let buff = new Buffer.from(mail_data.payload.body.data, 'base64')
                                    let text = buff.toString('utf8');
                                    mail_data.decoded_body = []
                                    mail_data.decoded_body[0] = text
                                }
                                if(mail_data.payload.parts)
                                {
                                    let obj = mail_data.payload.parts.find(x => x.mimeType === 'text/html')
                                    let buff = new Buffer.from(obj.body.data, 'base64');
                                    let text = buff.toString('utf8');
                                    mail_data.decoded_parts = []
                                    mail_data.decoded_parts[0] = text
                                }
                            }



                            /*if(mail_data.payload.body.data)
                            {
                                let buff = new Buffer.from(mail_data.payload.body.data, 'base64')
                                let text = buff.toString('utf8');
                                mail_data.decoded_body = []
                                mail_data.decoded_body[0] = text
                            }
                            if(mail_data.payload.parts)
                            {
                                let obj = mail_data.payload.parts.find(x => x.mimeType === 'text/html')
                                let buff = new Buffer.from(obj.body.data, 'base64');
                                let text = buff.toString('utf8');
                                mail_data.decoded_parts = []
                                mail_data.decoded_parts[0] = text
                            }*/

                            formatedResponse.push(mail_data)

                            if (index === allMails.length -1) resolve();
                            // if(allMails.length == (index + 1))
                            // {
                            //     auth.expressResponse.send(formatedResponse)
                            // }
                            //console.log("data", formatedResponse)
                        })
                        //console.log("index", index)

                    });
                });

                allMailsPromise.then(() => {
                    auth.expressResponse.send(formatedResponse)
                });
            }




        });
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