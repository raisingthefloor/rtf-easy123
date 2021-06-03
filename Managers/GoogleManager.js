const {google} = require('googleapis')

exports.getToken = async function (code) {
    return new Promise((resolve, reject) => {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
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
            labelIds: ['UNREAD','INBOX']
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err)

            if(res.data && res.data.messages)
            {
                resolve(res.data.messages)
            }
            else
            {
                reject("Unable to data from gmail.users.messages")
            }
        })

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