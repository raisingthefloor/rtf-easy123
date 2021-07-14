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
async listUnreadMessages(auth) {
    console.log("GoogleManager", GoogleManager)
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
            let allMailsPromise = async function() {
                new Promise((resolve, reject) => {
                    allMails.forEach((element, index) => {

                        gmail.users.messages.get({
                            userId: 'me',
                            id: element.id
                        }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);
                            console.log("data", res.data)
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

                                let attachments = mail_data.payload.parts.filter(obj => obj.mimeType != "multipart/alternative")
                                mail_data.decoded_attachments = attachments

                                //add attachments to existing body

                                if(text.includes("</body>"))
                                {
                                    //<body> exists
                                    GoogleManager.attachmentHTMLFun(text)
                                        .then((att_html) => {
                                            let temp_att_html = att_html
                                            temp_att_html += "</body>"
                                            text = text.replace("</body>", temp_att_html)
                                        })
                                }
                                else
                                {
                                    //<body> does not exists
                                    console.log("GoogleManager", GoogleManager)
                                    let att_html = await GoogleManager.attachmentHTMLFun(text)
                                    console.log("att_html", att_html)
                                    /*.then((att_html) => {
                                        text += att_html
                                    })*/

                                }



                                mail_data.decoded_parts = []
                                mail_data.decoded_parts[0] = text
                                //console.log("text",text)
                                //const root = parse(html)
                                //console.log("root", root)

                                //console.log("mail_data_alternative, mixed", mail_data_alternative)

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
            }


            allMailsPromise.then(() => {
                auth.expressResponse.send(formatedResponse)
            });
        }




    });
}