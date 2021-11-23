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

const Imap = require('qboxmail-imap');
const { inspect } = require('util');
const logger = require('../../../logger/api.logger')
//const {Buffer} = require('buffer');
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require("nodemailer");
const mimemessage = require('mimemessage'); //using this module to construct mime message
const {User} = require('../../Auth/Models/user.model');
const Sentry = require("@sentry/node")
const SMTPConnection = require("nodemailer/lib/smtp-connection")
const HelperManager = require("../../../Managers/HelperManager")

//const { StringDecoder } = require('string_decoder');
//const decoder = new StringDecoder('utf8');

//Imap connection handler to handle imap connection to remote IMAP server
//Configurations are hard coded for now


//SMTP Tansport

let imapConnections = []
process.setMaxListeners(0)

class ImapController {
    imapClient

    /**
     * construct IMAP obj
     * @param req
     * @param res
     */
    async constructIMAP(req, res) {
        return new Promise(async (resolve, reject) => {
            //console.log("imap connections", imapConnections)
            let user = await HelperManager.getLoggedInUser(req.decoded)
            //check if imapClient exists
            let imapClientObj = imapConnections.find(con => con.username == user.imapUsername)

            if (!imapClientObj) {
                let imapClient
                imapClient = new Imap({
                    user: user.imapUsername,
                    password: user.imapPassword,
                    host: user.imapHost,
                    port: 993,
                    tls: true,
                    tlsOptions: {
                        rejectUnauthorized: false
                    }/*,
                debug: function(p) {
                    console.log("debug", p)
                }*/
                })
                //console.log("new connection")
                await imapClient.connect()

                imapConnections.push({
                    username: user.imapUsername,
                    imapClient: imapClient
                })

                resolve(imapClient)
                return
            }

            //console.log("existing connection", imapClientObj.imapClient.state)
            resolve(imapClientObj.imapClient)
            //return imapClientObj.imapClient
        })
    }

    /** delete imap object from imapConnections after socket disconnected **/
    async deleteIMAPObjectFromConnections(req, res) {
        let user = await HelperManager.getLoggedInUser(req.decoded)

        imapConnections = imapConnections.filter(con => con.username != user.imapUsername)
    }

    /**
     * construct SMTP obj
     * @param req
     * @param res
     */
    async constructSMTP(req, res) {
        const requestUser = await User.findOne({
            _id: req.decoded.id
        })
        if (requestUser.role == "assistant") {
            //find user
            const user = await User.findOne({
                createdBy: requestUser.id,
                role: 'user'
            })
            //console.log("user.smtpUseTlsSsl", user.smtpUseTlsSsl)
            //465 => secure = true
            //587 => secure = false
            this.transporter = nodemailer.createTransport({
                host: user.smtpHost,
                port: user.smtpPortNumber,
                secure: user.smtpUseTlsSsl, // true for 465, false for other ports
                auth: {
                    user: user.smtpUsername,
                    pass: user.smtpPassword
                },
            })
        } else if (requestUser.role == "user") {
            this.transporter = nodemailer.createTransport({
                host: requestUser.smtpHost,
                port: requestUser.smtpPortNumber,
                secure: requestUser.smtpUseTlsSsl, // true for 465, false for other ports
                auth: {
                    user: requestUser.smtpUsername,
                    pass: requestUser.smtpPassword
                },
            })
        }
    }

    /** Opens a mailbox and processes the passed callback **/
    async openMailBox(boxType, readOnly, imapClient, req, res, callback) {
        //console.log(this.imapClient.state)
        imapClient.openBox(boxType, readOnly, callback)
        /*if (imapClient.state === 'authenticated') {
            imapClient.openBox(boxType, readOnly, callback)
        }
        else {
            await imapClient.connect()

            imapClient.on('ready', function () {
                console.log("imap client connected")
                imapClient.openBox(boxType, readOnly, callback)
            })
            console.log("status", imapClient.state)
        }*/

    }

    //gets all messages from inbox + trash
    async getAllMails(req, res) {
        let imapClient = await this.constructIMAP(req, res)
        //console.log("getAllMails")
        if (imapClient.state === "authenticated") {
            //console.log("getAllMails imapClient authenticated")
            //imapClient.connect()
            this.getAllMailsCode(req, res, imapClient)
        }

        imapClient.once('ready', () => {
            //console.log("imapClient ready")
            this.getAllMailsCode(req, res, imapClient)
        })
    }

    getAllMailsCode(req, res, imapClient) {
        let self = this
        //Variables used for response status and payload
        let error = false, responseCode = 200;
        let data = [], status = 'success', payload = {};

        //Check whether user exists for the decoded id
        User.findOne({_id: req.decoded.id})
            .then(async user => {
                //user is found
                if (user) {
                    //console.log("user found")
                    this.openMailBox('INBOX', true, imapClient, req, res, async (err, box) => {
                        //console.log("mailbox opened")
                        if (!err) {
                            if(box.messages.total)
                            {
                                //imapClient.seq.search(['INBOX', ['SINCE', 'May 20, 2018']])
                                /*let fetchedMessagesEvent = imapClient.seq.fetch((box.messages.total) + ":1", {
                                    bodies: '',
                                    struct: true
                                })*/
                                let getMessageCount = 10
                                if(box.messages.total < 10)
                                {
                                    getMessageCount = box.messages.total
                                }
                                let mailDate = new Date();
                                mailDate.setDate(mailDate.getDate() - 7)
                                imapClient.search([['ALL'], ['SINCE', mailDate] ], function(err, results) {
                                    //console.log("results", results)
                                    if(!results.length)
                                    {
                                        imapClient.closeBox(async (err) => {
                                            //console.log("imapClient closeBox")
                                            if (!err) {
                                                //method to get messages from trash box
                                                //check if calling for the first time
                                                if(req.query.isFirst && req.query.isFirst == 1)
                                                {
                                                    self.getTrashedMessages(imapClient, data, payload, req, res);
                                                }
                                                else
                                                {
                                                    if (!res.headersSent) {
                                                        res.status(responseCode).send({
                                                            error,
                                                            total: !error ? data.length : 0,
                                                            data,
                                                            message: !error ? status : 'Some error has occured.'
                                                        })
                                                    }
                                                }



                                                /*if (!res.headersSent) {
                                                    res.status(responseCode).send({
                                                        error,
                                                        total: !error ? data.length : 0,
                                                        data,
                                                        message: !error ? status : 'Some error has occured.'
                                                    })
                                                }*/

                                                //return
                                            } else {
                                                console.log(err)
                                                logger.error('imap closebox :: ' + err);
                                                Sentry.captureException(err)
                                                if (!res.headersSent) {
                                                    res.status(responseCode).send({
                                                        error,
                                                        total: !error ? data.length : 0,
                                                        data,
                                                        message: !error ? status : 'Some error has occured.'
                                                    })
                                                }
                                            }
                                        })
                                        return
                                    }
                                //imapClient.search([['ALL'], ['SINCE', 'Nov 15, 2021'] ], function(err, results) {
                                    let fetchedMessagesEvent = imapClient.fetch(results, {
                                        bodies: '',
                                        struct: true
                                    })

                                    //a message is received
                                    fetchedMessagesEvent.on('message', (msg, seqno) => {
                                        //console.log("fetchedMessagesEvent message", msg, seqno)
                                        //message body is loaded
                                        msg.on('body', (stream, info) => {
                                            //console.log("msg body")
                                            //all the data is received from stream
                                            stream.once('end', () => {
                                                //console.log("stream end")
                                            })
                                            //handling message attributes
                                            msg.once('attributes', attrs => {
                                                //console.log("msg attributes")
                                                //using mailparser to parse message body
                                                simpleParser(stream, (err, mail) => {
                                                    let isRead = "unread", isTrashed = "none";
                                                    if (attrs.flags.includes("\\Seen")) {
                                                        isRead = "read";
                                                        isTrashed = "tray";
                                                    }
                                                    const {to, from, subject, text, html, date, attachments, messageId} = mail;
                                                    payload = {
                                                        date,
                                                        to: to ? to.text : user.name,
                                                        from: from.text,
                                                        subject,
                                                        text,
                                                        html,
                                                        r: isRead,
                                                        t: isTrashed,
                                                        in: 'c',
                                                        attachments,
                                                        messageId,
                                                        attrs
                                                    };
                                                    data.push(payload);
                                                })
                                            })
                                        })

                                        msg.once('end', async () => {
                                            //console.log("msg end")
                                        })
                                    })

                                    //an error occurs on fetching messages
                                    fetchedMessagesEvent.once('error', (err) => {
                                        error = true;
                                        //console.log("fetchedMessagesEvent error")

                                        responseCode = 500;
                                        if (!res.headersSent) {
                                            res.status(responseCode).send({
                                                error,
                                                total: !error ? data.length : 0,
                                                data,
                                                message: !error ? status : 'Some error has occured.'
                                            })
                                        }

                                        logger.error('Imap Fetch Error :: ' + err);
                                        console.log(err)
                                        Sentry.captureException(err)
                                    })

                                    //all messages from inbox  are fetched
                                    fetchedMessagesEvent.once('end', async () => {
                                        //console.log("fetchedMessagesEvent end")
                                        //close inbox and open trashbox
                                        //console.log(this.imapClient)
                                        imapClient.closeBox(async (err) => {
                                            //console.log("imapClient closeBox")
                                            if (!err) {
                                                //method to get messages from trash box
                                                //check if calling for the first time
                                                if(req.query.isFirst && req.query.isFirst == 1)
                                                {
                                                    self.getTrashedMessages(imapClient, data, payload, req, res);
                                                }
                                                else
                                                {
                                                    if (!res.headersSent) {
                                                        res.status(responseCode).send({
                                                            error,
                                                            total: !error ? data.length : 0,
                                                            data,
                                                            message: !error ? status : 'Some error has occured.'
                                                        })
                                                    }
                                                }



                                                /*if (!res.headersSent) {
                                                    res.status(responseCode).send({
                                                        error,
                                                        total: !error ? data.length : 0,
                                                        data,
                                                        message: !error ? status : 'Some error has occured.'
                                                    })
                                                }*/

                                                //return
                                            } else {
                                                console.log(err)
                                                logger.error('imap closebox :: ' + err);
                                                Sentry.captureException(err)
                                                if (!res.headersSent) {
                                                    res.status(responseCode).send({
                                                        error,
                                                        total: !error ? data.length : 0,
                                                        data,
                                                        message: !error ? status : 'Some error has occured.'
                                                    })
                                                }
                                            }
                                        })
                                        //imapClient.end();
                                    })
                                })
                                /*let fetchedMessagesEvent = imapClient.seq.fetch(getMessageCount + ":1", {
                                    bodies: '',
                                    struct: true
                                })*/

                                //console.log(box)


                            }
                            else
                            {

                                imapClient.closeBox(async (err) => {
                                    //console.log("imapClient closeBox")
                                    if (!err) {
                                        if(req.query.isFirst && req.query.isFirst == 1)
                                        {
                                            this.getTrashedMessages(imapClient, data, payload, req, res);
                                        }
                                        else
                                        {
                                            if (!res.headersSent) {
                                                res.status(responseCode).send({
                                                    error,
                                                    total: !error ? data.length : 0,
                                                    data,
                                                    message: !error ? status : 'Some error has occured.'
                                                })
                                            }
                                        }
                                        //method to get messages from trash box
                                        //this.getTrashedMessages(imapClient, data, payload, req, res);


                                        /*if (!res.headersSent) {
                                            res.status(responseCode).send({
                                                error,
                                                total: !error ? data.length : 0,
                                                data,
                                                message: !error ? status : 'Some error has occured.'
                                            })
                                        }*/

                                        return
                                    } else {
                                        console.log(err)
                                        logger.error('imap closebox :: ' + err);
                                        Sentry.captureException(err)
                                        if (!res.headersSent) {
                                            res.status(responseCode).send({
                                                error,
                                                total: !error ? data.length : 0,
                                                data,
                                                message: !error ? status : 'Some error has occured.'
                                            })
                                        }
                                    }
                                })
                                /*let dataRes = {
                                    error: false,
                                    data: [],
                                    message: "success"
                                }
                                res.send(dataRes)
                                return*/
                            }

                        }
                        else {
                            console.log(err)
                            logger.error('imap connection error :: ' + err);
                            Sentry.captureException(err)
                            let dataRes = {
                                error: true,
                                data: null,
                                message: err
                            }
                            let errObj = JSON.parse(err)
                            if(errObj.source == "socket")
                            {
                                //delete object from connections
                                this.deleteIMAPObjectFromConnections(req, res, imapClient)
                            }

                            if (!res.headersSent) {
                                res.status(500).send(dataRes)
                            }

                            return
                            error = true;
                        }
                    })


                    imapClient.once('error', (err) => {
                        //console.log("imapClient error")
                        //this.imapClient.end();
                        let textError = String(err)
                        error = true;
                        responseCode = 500
                        err.customMessage = textError

                        let dataRes = {
                            error: true,
                            data: null,
                            message: err
                        }
                        if (!res.headersSent) {
                            res.status(500).send(dataRes)
                        }


                        console.log(err)
                        logger.error('imap connection error :: ' + err);
                        Sentry.captureException(err)
                        return
                    });

                    imapClient.once('end', () => {
                        //console.log("imapClient end")
                        if (!res.headersSent) {
                            res.status(responseCode).send({
                                error,
                                total: !error ? data.length : 0,
                                data,
                                message: !error ? status : 'Some error has occured.'
                            })
                        }
                    })

                    //Establish Connection using imap client to an imap server
                    //imapClient.connect();
                } else {
                    responseCode = 400;
                    error = true;
                    if (!res.headersSent) {
                        res.status(responseCode).send({
                            error,
                            message: "Authentication Error"
                        });
                    }

                }
            })
            .catch(err => {
                error = true;
                responseCode = 500;
                if (!res.headersSent) {
                    res.status(responseCode).send({
                        error,
                        total: !error ? data.length : 0,
                        data,
                        message: !error ? status : 'Some error has occured.'
                    });
                }
                console.log(err)
                Sentry.captureException(err)
            })
    }

    //this method is called after all the messages from inbox are fetched
    getTrashedMessages(imapClient, data, payload, req, res) {
        let error = false, responseCode = 200;
        let status = 'success'

        this.openMailBox("[Gmail]/Trash", false, imapClient, req, res, (err, box) => {
            //console.log("openMailBox trash")
            if (!err && box.messages?.total) {
                let trashedMessagesEvent = imapClient.seq.fetch((box.messages.total) + ":1", {
                    bodies: '',
                    struct: true
                })

                //a message is received
                trashedMessagesEvent.on('message', (msg, seqno) => {
                    //console.log("trashedMessagesEvent message", seqno)
                    //message body is loaded
                    msg.on('body', (stream, info) => {
                        //console.log("msg body")
                        //all the data is received from stream
                        stream.once('end', () => {
                            //console.log("stream end")
                        })
                        //handling message attributes
                        msg.once('attributes', attrs => {
                            //console.log("msg attributes")
                            //using mailparser to parse message body
                            simpleParser(stream, (err, mail) => {
                                let isRead = "unread", isTrashed = "none";
                                if (attrs.flags.includes("\\Seen")) {
                                    isRead = "read";
                                    isTrashed = "trash";
                                }
                                //console.log("isRead", isRead)
                                //console.log("isTrashed", isTrashed)
                                const {to, from, subject, text, html, date, attachments, messageId} = mail;
                                payload = {
                                    date, to: to ? to.text : '', from: from.text, subject, text, html,
                                    r: isRead, t: isTrashed, in: 'c', attachments, messageId, attrs
                                };
                                //console.log("payload t", payload.t)
                                data.push(payload);
                            })
                        })
                    })
                })

                trashedMessagesEvent.once('end', () => {
                    let returnInterval = setInterval(function(){
                        let deleted = data.filter(obj => obj.t == "trash")
                        if (!res.headersSent) {
                            if(deleted.length == box.messages.total)
                            {
                                clearInterval(returnInterval)
                                res.status(responseCode).send({
                                    error,
                                    total: !error ? data.length : 0,
                                    data,
                                    message: !error ? status : 'Some error has occured.'
                                })
                            }
                        }
                    }, 1000)
                    //imapClient.end();
                })
            } else {
                if (!res.headersSent) {
                    res.status(responseCode).send({
                        error,
                        total: !error ? data.length : 0,
                        data,
                        message: !error ? status : 'Some error has occured.'
                    })
                }

                //imapClient.end();
            }
        })
    }

    /**Searches the struct array object to return information about Mime type text/* */
    /*findTextPart(struct, uid){
        for(let i=0; i<struct.length; i++){
            if(Array.isArray(struct[i])){
                if(this.findTextPart(struct[i], uid)){
                    return this.findTextPart(struct[i], uid)
                }
            }
            else if(struct[i].type === 'text' && (struct[i].subtype === 'plain'
                || struct[i].subtype === 'html'))
            {
                //multiParts.push({uid, a:struct[i].partID, b:struct[i].type + '/' + struct[i].subtype});
                return [struct[i].partID, struct[i].type + '/' + struct[i].subtype]
            }
        }

    }*/

    /*getMsgByUID(uid, cb, partID){
        const self = this;
        var f = imapClient.fetch(uid, partID
            ? { bodies: ['HEADER.FIELDS (TO FROM SUBJECT)', '2'] }
            : { bodies: '', struct: true }),
        hadErr = false;

        if (partID)
            var msg = { header: undefined, body: '', attrs: undefined };

        f.on('error', function(err) {
            hadErr = true;
            cb(err);
        });

        if (!partID) {
            f.on('message', function(m) {
                m.on('attributes', function(attrs) {
                    partID = self.findTextPart(attrs.struct);
                    //console.log(partID);
                });
            });
            f.on('end', function() {
                //console.log("end");
                if (hadErr)
                    return;
                if (partID)
                    self.getMsgByUID(uid, cb, partID);
                else
                    cb(new Error('No text part found for message UID ' + uid));
            });
        }
        else {
            f.on('message', function(m) {
                m.on('body', function(stream, info) {
                    var b = '';
                    stream.on('data', function(d) {
                        b += d.toString('utf-8');
                    });
                    stream.on('end', function() {
                        if (/^header/i.test(info.which))
                            msg.header = Imap.parseHeader(b);
                        else{
                            b = Buffer.from(b.replace(/=([A-Fa-f0-9]{2})/g, function(m, byte) {
                                return String.fromCharCode(parseInt(byte, 16));
                              }), 'binary').toString('utf8');
                            msg.body = b;
                        }
                    });
                });
                m.on('attributes', function(attrs) {
                    msg.attrs = attrs;
                    msg.contentType = partID[1];
                });
            });
            f.on('end', function() {
                if (hadErr)
                return;
                cb(undefined, msg);
            });
        }
    }*/

    /*getParsedBody(struct, msgBody){
        //apply parsing logic only for multipart raw message
        let resultantBody = msgBody;
        if(struct.length > 1){
            let boundary = struct[0].params.boundary;
            resultantBody = msgBody.split(boundary);
            console.log(resultantBody.length);
            //decode only if encoding in a scheme different than 8bit
            if(!msgBody.includes('Content-Transfer-Encoding: 8bit')){
                msgBody = utf8.decode(quotedPrintable.decode(msgBody));
            }
        }
        return;
        //console.log(resultantBody);
        //return resultantBody;
        //console.log(msgBody);
    }*/

    async deleteEmailMessages(req, res) {
        let imapClient = this.constructIMAP(req, res)

        if (imapClient.state === "authenticated") {
            this.deleteEmailMessagesCode(req, res, imapClient)
        }

        imapClient.once('ready', () => {
            //console.log("imapClient ready")
            this.deleteEmailMessagesCode(req, res, imapClient)
        })
    }

    deleteEmailMessagesCode(req, res, imapClient) {
        //Opening the Inbox via IMAP
        openMailBox('INBOX', false, imapClient, req, res, (err, box) => {
            if (!err) {
                //sets the \Deleted flag on message
                imapClient.addFlags(req.params.id, 'Deleted', (err) => {
                    //closing the box with autoexpunge parameter = true removes the message
                    //from mailbox

                    imapClient.closeBox(false, err => {
                        if (err) {
                            Sentry.captureException(err)
                            console.log(err)
                            logger.error("Error :: ", err)
                        }
                        //imapClient.end();
                    })
                })
            } else {
                Sentry.captureException(err)
                console.log(err)
                logger.error("Error :: ", err);
            }
        })

        /*imapClient.once('ready', () => {

        });*/

        /*imapClient.once('error', (err) => {
            imapClient.end();
            // error = true;
            // responseCode = 500;
            if(err)
            {
                logger.error('imap connection error :: '+err);
                console.log(err)
                Sentry.captureException(err)
            }

        });*/

        /*imapClient.once('end', () => {
            logger.info("Connection ended");
            // res.status(responseCode).send({error,
            //     total: !error ? data.length : 0,
            //     data,
            //     message: !error ? status : 'Some error has occured.'
            // });
        });*/
    }

    writeMail(data, isError, req, res) {
        //Connecttion established
        let imapClient = this.constructIMAP(req, res)

        if (imapClient.state === "authenticated") {
            this.writeMailCode(data, isError, imapClient)
        }

        imapClient.once('ready', () => {
            //console.log("imapClient ready")
            this.writeMailCode(data, isError, imapClient)
        })

        imapClient.once('error', (err) => {
            isError.error = true;
        })
        imapClient.once('end', () => {
            return;
        })
    }

    writeMailCode(data, isError, imapClient)
    {
        let msg, htmlEntity, plainEntity;
        // Build the top-level multipart MIME message.
        msg = mimemessage.factory({
            contentType: 'multipart/alternative',
            body: []
        });
        //HTML Part of message
        htmlEntity = mimemessage.factory({
            contentType: 'text/html;charset=utf-8',
            body: data.html
        });

        //Plain text part
        plainEntity = mimemessage.factory({
            body: data.text
        });
        msg.header('From', data.from);
        msg.header('To', data.to);
        msg.header('Subject', data.subject);
        if (data.html) {
            msg.body.push(htmlEntity);
        } else {
            msg.body.push(plainEntity);
        }
        imapClient.append(msg.toString(), {mailbox: '[Gmail]/Sent Mail'}, (err) => {
            if (err) isError.error = true;
            logger.info("Message sent!!!");
            this.imapClient.end();
        });
    }

    async sendMail(req, res) {
        await this.constructSMTP(req, res)
        let isError = {error: false};
        const {from, to, subject, html, text, replyTo, inReplyTo} = req.body;
        let msg = {
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
        };

        //is a reply to message
        if (replyTo || inReplyTo) {
            msg = Object.assign({}, msg, {replyTo, inReplyTo});
        }
        let info = await this.transporter.sendMail(msg);
        //writing the sent mail in sender's sent box
        this.writeMail(msg, isError, req, res);
        res.send(Object.assign({}, msg, {messageId: info.messageId}, isError));
        //res.send(null);
    }

    async moveMail(req, res) {
        let imapClient = await this.constructIMAP(req, res)
        let error = false, message = "success";
        //move message from inbox to trash
        let source = "INBOX", destination = "[Gmail]/Trash";
        //move message from trash to Inbox
        if (req.params.box === "inbox") {
            source = "[Gmail]/Trash";
            destination = "INBOX";
        }
        let mails = req.body
        this.openMailBox(source, false, imapClient, req, res, (err, box) => {
            if (!err && box.messages.total) {
                mails.forEach(mail => {
                    const {from, to, subject, date} = mail;
                    imapClient.search([
                        ['FROM', this.strip_html(from)],
                        ['TO', this.strip_html(to)],
                        ['SUBJECT', subject],
                        ['ON', date]
                    ], async (err, results) => {
                        if (!err && results.length) {
                            //await this.constructIMAP(req, res)
                            imapClient.move(results, destination, err => {
                                if (!err) {
                                    logger.info(`Message move from ${source} to ${destination}`)

                                    res.send({
                                        error,
                                        message: error ? "Something went wrong. Please contact admin" : message
                                    })
                                    //this.imapClient.end();
                                } else {
                                    Sentry.captureException(err)
                                    console.log(err)
                                    logger.error("Error :: ", err)

                                    res.send({
                                        error,
                                        message: error ? "Something went wrong. Please contact admin" : message
                                    })
                                }
                            });
                        }
                        else if(err) {
                            logger.error(err);
                            console.log(err)
                            Sentry.captureException(err)

                            error = true
                            res.send({error, message: error ? "Something went wrong. Please contact admin" : message})
                            //await this.constructIMAP(req, res)
                            //this.imapClient.end();
                        }
                        else
                        {
                            imapClient.search([
                                //['FROM', this.strip_html(from)],
                                //['TO', this.strip_html(to)],
                                ['SUBJECT', subject],
                                ['ON', date]
                            ], async (err, results) => {
                                if(err)
                                {
                                    logger.error(err);
                                    console.log(err)
                                    Sentry.captureException(err)

                                    error = true
                                    res.send({error, message: error ? "Something went wrong. Please contact admin" : message})
                                }
                                else if(results.length)
                                {
                                    //await this.constructIMAP(req, res)
                                    imapClient.move(results, destination, err => {
                                        if (!err) {
                                            logger.info(`Message move from ${source} to ${destination}`)

                                            res.send({
                                                error,
                                                message: error ? "Something went wrong. Please contact admin" : message
                                            })
                                            //this.imapClient.end();
                                        } else {
                                            Sentry.captureException(err)
                                            console.log(err)
                                            logger.error("Error :: ", err)

                                            res.send({
                                                error,
                                                message: error ? "Something went wrong. Please contact admin" : message
                                            })
                                        }
                                    });
                                }
                                else {
                                    error = false
                                    message = "no_message"
                                    res.send({error, message: error ? "Something went wrong. Please contact admin" : message});
                                }
                            })

                        }

                    })
                });
            }
            else if(err) {
                console.log("here5")
                logger.error(err);
                console.log(err)
                Sentry.captureException(err)
                res.send({error, message: error ? "Something went wrong. Please contact admin" : message});
                //this.imapClient.end();
            }
            else {
                console.log("here6")
                error = false
                message = "no_message"
                res.send({error, message: error ? "Something went wrong. Please contact admin" : message});
            }
        })

    }

    async setFlags(req, res) {
        let imapClient = await this.constructIMAP(req, res)

        let error = false, message = "success";
        let flag = "\\" + req.params.flag.charAt(0).toUpperCase() + req.params.flag.slice(1);

        this.openMailBox('INBOX', false, imapClient, req, res, async (err, box) => {
            if (!err) {
                //logger.info(box.messages.new);
                imapClient.addFlags(req.params.uid, "\\Seen", async () => {
                    //logger.info("Flag added");
                    //this.imapClient.end();
                    res.send({error, message: error ? "Something went wrong. Please contact admin" : message});
                });
                //imapClient.end();
            } else {
                logger.error('error :: ' + err);
                console.log(err)
                Sentry.captureException(err)

                error = true;

                res.send({error, message: error ? "Something went wrong. Please contact admin" : message});
            }
        })
    }

    strip_html(str) {
        if ((str === null) || (str === '') || str === undefined) {
            return '';
        } else {
            str = str.toString();
            return str.replace(/<[^>]*>/g, '').trim();
        }

    }

    /**
     * test SMTP connection
     */
    async testSMTPConnection(req, res) {
        //console.log("outgoing mail", req.body.smtp_use_tls_ssl)
        let secure = false
        if (req.body.smtp_port == 465) {
            secure = true
        }
        let options = {
            host: req.body.smtp_host,
            port: req.body.smtp_port,
            secure: req.body.smtp_use_tls_ssl,
            auth: {
                user: req.body.smtp_username,
                pass: req.body.smtp_password
            },

            connectionTimeout: 2000,
            /*logger: true,
            transactionLog: true,
            debug: true*/
        }
        //console.log("options", options)


        try {
            var connection = new SMTPConnection(options)

            connection.on('connect', function () {
                //console.log("connect")
                /*res.send({
                    status: true,
                    data: null,
                    message: 'success'
                })*/
            })
            connection.on('error', function (err) {
                //console.log("errr", err)
                if (!res.headersSent) {
                    res.send({
                        status: false,
                        data: null,
                        error: err,
                        message: 'failed'
                    })
                }
                console.log(err)
                Sentry.captureException(err)
            })
            connection.on('end', function (err) {
                //console.log("connection ended")
                if (!res.headersSent) {
                    res.send({
                        status: false,
                        data: null,
                        error: {
                            code: 'CUSTOM_CONNECTION_CLOSED'
                        },
                        message: 'failed'
                    })
                }
            })

            connection.connect(function (err) {
                //console.log("connection callback", err)
                if (err) {
                    res.send({
                        status: false,
                        data: null,
                        error: err,
                        message: 'failed'
                    })
                    Sentry.captureException(err)
                    console.log(err)
                } else {
                    connection.login({
                        user: req.body.smtp_username,
                        pass: req.body.smtp_password
                    }, function (err1) {
                        //console.log(err1)
                        if (err1) {
                            res.send({
                                status: false,
                                data: null,
                                error: err1,
                                message: 'failed'
                            })
                            console.log(err1)
                            Sentry.captureException(err1)
                        } else {
                            res.send({
                                status: true,
                                data: null,
                                message: 'success'
                            })
                        }

                    })
                }


            })

            /*res.send({
                status: true,
                data: null,
                message: 'success'
            })*/

        } catch (err) {
            res.send({
                status: false,
                data: null,
                error: err,
                message: 'failed'
            })
            console.log(err)
            logger.error('Error::' + err)
            Sentry.captureException(err)
        }


    }

    /** test IMAP connection **/
    async testIMAPConnection(req, res) {
        let imapOptions = {
            user: req.query.imap_username,
            password: req.query.imap_password,
            host: req.query.imap_host,
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            }
        }

        let imapClient = new Imap(imapOptions)

        imapClient.connect()

        //Variables used for response status and payload
        let error = false, responseCode = 200;
        let data = [], status = 'success', payload = {};

        imapClient.once('ready', async () => {
            imapClient.end()
        })

        imapClient.once('error', (err) => {
            imapClient.end();
            let textError = String(err)
            error = true;
            responseCode = 500
            err.customMessage = textError

            let dataRes = {
                error: true,
                data: null,
                message: err
            }
            res.status(500).send(dataRes)
            console.log(err)
            logger.error('imap connection error :: '+err);

            Sentry.captureException(err)

        });

        imapClient.once('end', () => {
            if(!res.headersSent)
            {
                res.status(responseCode).send({error,
                    total: !error ? data.length : 0,
                    data,
                    message: !error ? status : 'Some error has occured.'
                });
            }

        });



    }
}

module.exports = new ImapController()