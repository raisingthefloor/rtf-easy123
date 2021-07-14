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
const {google} = require('googleapis')

exports.getToken = async function (code) {
    return new Promise((resolve, reject) => {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, process.env.GOOGLE_REDIRECT_URI);
        oAuth2Client.getToken(code, (err, token) => {

            if (err) return console.error('Error retrieving access token', err);

            //oAuth2Client.setCredentials(token)
            resolve(token)
        });
    })
}

exports.getUserProfile = async function (auth) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})

        gmail.users.getProfile({
            userId: "me",
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err + 'Error while fetching profile')

            resolve(res.data)
        })
    })
}

exports.sendMail = async function (auth, raw) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})
        gmail.users.messages.send({
            auth: auth,
            userId: 'me',
            resource: {
                raw: raw
            }
        }, function(err, response) {
            if (err) return console.log('The API returned an error: ' + err);
            resolve(response)
        });
    })
}

exports.attachmentHTML = async function (auth, messageId, attachments) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})
        let html = ""
        let obj = {
            decoded_attachment: [],
            html: ""
        }
        if(attachments.length)
        for (let attachment of attachments)
        {
            //get blob URL
            /*gmail.users.messages.attachments.get({
                userId: 'me',
                messageId: messageId,
                id: attachment.body.attachmentId
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err + 'Cound not load message attachments')
                obj.decoded_attachment.push(res.data.data)
                //obj.decoded_attachment = res.data.data

            })*/
            html += `<a href="" <div style="margin-top: 0.5rem; padding: 0.3rem; border: 1px solid #ccc; cursor: pointer;" @click="downloadAttachment('`+messageId+`', '`+attachment.body.attachmentId+`')">
                `+attachment.filename+`
            </div>`
            obj.html = html
        }

        resolve(obj)


    })
}

exports.attachmentData = async function (auth, messageId, attachment) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})
        gmail.users.messages.attachments.get({
            userId: 'me',
            messageId: messageId,
            id: attachment.body.attachmentId
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err + 'Could not load message attachment')
            resolve(res.data)
            //console.log("res.data", res.data)

        })
    })
}

exports.b64toBlob = async function (b64Data, contentType, sliceSize) {
    return new Promise((resolve, reject) => {
        contentType = contentType || ''
        sliceSize = sliceSize || 512

        var byteCharacters = atob(b64Data)
        var byteArrays = []

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize)

            var byteNumbers = new Array(slice.length)
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i)
            }

            var byteArray = new Uint8Array(byteNumbers)

            byteArrays.push(byteArray)
        }

        var blob = new Blob(byteArrays, {type: contentType})
        let urlBlob = URL.createObjectURL(blob)
        return urlBlob
    })
}

exports.attachmentDataURL = async function (auth, messageId, attachment) {
    return new Promise((resolve, reject) => {


    })
}

exports.getUnreadMessages = async function (auth) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})

        gmail.users.messages.list({
            userId: 'me',
            labelIds: ['UNREAD','INBOX'],
            maxResults: 20,
            includeSpamTrash: false
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err)
            //console.log("res.data.messages", res.data.messages)
            if(res.data && res.data.messages)
            {
                resolve(res.data.messages)
            }
            else
            {
                resolve([])
                //reject("Unable to data from gmail.users.messages")
            }
        })

    })
}

//get all messages & trash all messages
exports.trashAllMessagesDemo = async function (auth, user) {
    return new Promise((resolve, reject) => {
        if(user.googleEmail == "easy123.tracecenter@gmail.com")
        {
            const gmail = google.gmail({version: 'v1', auth})

            //trash all mails
            gmail.users.messages.list({
                userId: 'me',
                labelIds: ['INBOX'],
                maxResults: 20
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err)
                //console.log("res.data.messages", res.data.messages)
                if(res.data && res.data.messages)
                {
                    //resolve(res.data.messages)
                    let result = res.data.messages.map(a => a.id)
                    //console.log("result", result)
                    gmail.users.messages.batchDelete({
                        userId: 'me',
                        ids: result
                    }, (err, res) => {
                        if (err) return console.log('The API returned an error: ' + err)
                        //console.log('All messages deleted')
                        resolve(true)
                    })
                }
                else
                {
                    resolve([])
                    //reject("Unable to data from gmail.users.messages")
                }
                //resolve([])
            })
        }
        else {
            resolve(true)
        }

    })
}


//send 2 new emails
exports.sendTwoNewEmailsDemo = async function(auth, user) {
    return new Promise((resolve, reject) => {
        if(user.googleEmail == "easy123.tracecenter@gmail.com")
        {
            //send 2 new mail
            const mailjet = require('node-mailjet')
                .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
            const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages": [{
                        "From": {
                            "Email": "no-reply@plenartech.com",
                            "Name": "John Doe"
                        },
                        "To": [{
                            "Email": "easy123.tracecenter@gmail.com",
                            "Name": "Alice Trace"
                        }],
                        "Subject": "Happy Birthday !!",
                        //"TextPart": "Hi Grandma,",
                        "HTMLPart": "Hi Grandma, <br><br> Wish you a happy birthday!!<br><br>Love<br>John"
                    }]
                })
            request
                .then((result) => {
                    //console.log("first mail sent")

                    const request1 = mailjet
                        .post("send", {'version': 'v3.1'})
                        .request({
                            "Messages": [{
                                "From": {
                                    "Email": "no-reply@plenartech.com",
                                    "Name": "Gregg Vanderheiden"
                                },
                                "To": [{
                                    "Email": "easy123.tracecenter@gmail.com",
                                    "Name": "Alice Trace"
                                }],
                                "Subject": "Picnic",
                                //"TextPart": "Hi Grandma,",
                                "HTMLPart": "Hi, <br><br> Would you like to join us for picnic this weekend?<br><br>Regards<br>Gregg"
                            }]
                        })
                    request1
                        .then((result) => {
                            //console.log("second mail sent")
                            //console.log(result.body)
                            resolve(true)
                        })
                        .catch((err) => {
                            console.log(err)
                        })


                })
                .catch((err) => {
                    console.log(err)
                })




        }
        else {
            resolve(true)
        }
    })
}

//get message details to send it to API
exports.getMessageDetails = async function (auth, allMails) {
    return new Promise((resolve, reject) => {
        let allProcessedMails = []
        for(let mail of allMails) {
            //let mail_detail = await exports.getSingleProcessedMessageDetails(auth, message)

        }
    })
}

//get processed message details for single message
exports.getSingleProcessedMessageDetails = async function (auth, message) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})
        gmail.users.messages.get({
            userId: 'me',
            id: message.id
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err + ' and Message ID: ' + message.id)

            let mail_data = res.data
            let headers = mail_data.payload.headers

            if(mail_data.payload.mimeType == "multipart/mixed")
            {
                let messageId = headers.find(obj => obj.name == "Message-ID")
                let mail_data_alternative = mail_data.payload.parts.find(x => x.mimeType == "multipart/alternative")
                let html_part = mail_data_alternative.parts.find(y => y.mimeType == "text/html")
                let buff = new Buffer.from(html_part.body.data, 'base64')
                let text = buff.toString('utf8')
                let attachments = mail_data.payload.parts.filter(obj => obj.mimeType != "multipart/alternative")
                mail_data.decoded_attachments = attachments

                mail_data.decoded_body = []
                mail_data.decoded_body[0] = text
                /*if(text.includes("</body>"))
                {
                    //<body> exists
                    exports.attachmentHTML(auth, messageId, attachments)
                        .then((att_html) => {
                            att_html.html += "</body>"
                            text = text.replace("</body>", att_html)
                            mail_data.decoded_body = []
                            mail_data.decoded_body[0] = text
                            mail_data.decoded_a = []
                            mail_data.decoded_a = att_html.decoded_attachment
                        })
                }
                else
                {
                    //<body> does not exists
                    exports.attachmentHTML(auth, messageId, attachments).then((att_html) => {
                        text += att_html.html
                        mail_data.decoded_body = []
                        mail_data.decoded_body[0] = text
                        mail_data.decoded_a = []
                        mail_data.decoded_a = att_html.decoded_attachment
                    })
                }*/
            }
            else if (mail_data.payload.mimeType == "multipart/alternative")
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
            else if (mail_data.payload.mimeType == "text/html")
            {
                let buff = new Buffer.from(mail_data.payload.body.data, 'base64')
                let text = buff.toString('utf8');
                mail_data.decoded_body = []
                mail_data.decoded_body[0] = text
            }

            resolve(mail_data)
        })
    })
}

//get single message details from gmail api
exports.getSingleMessageDetails = async function (auth, message) {
    return new Promise((resolve, reject) => {
        gmail.users.messages.get({
            userId: 'me',
            id: message.id
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err + ' and Message ID: ' + message.id)
            resolve(res.data)
        })
    })
}