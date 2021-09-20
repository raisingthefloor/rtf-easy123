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

//const { StringDecoder } = require('string_decoder');
//const decoder = new StringDecoder('utf8');

//Imap connection handler to handle imap connection to remote IMAP server
//Configurations are hard coded for now


//SMTP Tansport

class ImapController {
    imapClient

    /**
     * construct IMAP obj
     * @param req
     * @param res
     */
    async constructIMAP(req, res) {

        if(req.query && req.query.test)
        {
            let imapOptions = {
                user: req.query.imap_username,
                password: req.query.imap_password,
                host: req.query.imap_host,
                port: 993,
                tls: true,
                tlsOptions: {
                    rejectUnauthorized: false
                },
                authTimeout: 30000
            }
            this.imapClient = new Imap(imapOptions)
        }
        else
        {
            const requestUser = await User.findOne({
                _id: req.decoded.id
            })

            if(requestUser.role == "assistant")
            {

                //find user
                const user = await User.findOne({
                    createdBy: requestUser.id,
                    role: 'user'
                })
                this.imapClient = new Imap({
                    user: user.imapUsername,
                    password: user.imapPassword,
                    host: user.imapHost,
                    port: 993,
                    tls: true,
                    tlsOptions: {
                        rejectUnauthorized: false
                    },
                    authTimeout: 30000
                })
            }
            else if (requestUser.role == "user")
            {
                this.imapClient = new Imap({
                    user: requestUser.imapUsername,
                    password: requestUser.imapPassword,
                    host: requestUser.imapHost,
                    port: 993,
                    tls: true,
                    tlsOptions: {
                        rejectUnauthorized: false
                    },
                    authTimeout: 30000
                })
            }
        }



        /*this.imapClient = new Imap({
            user: "mayur@raisingthefloor.org",
            password: "vtjatsvmvtzadkzi",
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            },
            authTimeout: 30000
        })*/
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
        if(requestUser.role == "assistant")
        {
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
        }
        else if (requestUser.role == "user")
        {
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
        //console.log(req, res)
        /*this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "mayur@raisingthefloor.org",
                pass: "vtjatsvmvtzadkzi"
            },
        });*/

    }

    /**Opens a mailbox and processes the passed callback*/
    openMailBox(boxType, readOnly, callback){
        this.imapClient.openBox(boxType, readOnly, callback)
        //openBox(mailboxName, readOnly, callback)

    }
    //gets all messages from inbox + trash
    async getAllMails(req, res){
        await this.constructIMAP(req, res)

        //Variables used for response status and payload
        let error = false, responseCode = 200;
        let data = [], status = 'success', payload = {};

        //Check whether user exists for the decoded id
        User.findOne({_id: req.decoded.id})
            .then(user => {
                //user is found
                if(user){
                    //Imap Connection is Established
                    this.imapClient.once('ready', () => {
                        if(req.query && req.query.test)
                        {
                            this.imapClient.end()
                        }
                        else
                        {
                            //Opening the Inbox via IMAP
                            this.openMailBox('INBOX', true, (err, box) => {
                                if(!err){
                                    let fetchedMessagesEvent = this.imapClient.seq.fetch((box.messages.total)+":1", {
                                        bodies: '',
                                        struct: true
                                    });

                                    //a message is received
                                    fetchedMessagesEvent.on('message', (msg, seqno) => {

                                        //message body is loaded
                                        msg.on('body', (stream, info) => {

                                            //all the data is received from stream
                                            stream.once('end', () => {
                                            })
                                            //handling message attributes
                                            msg.once('attributes', attrs => {
                                                //using mailparser to parse message body
                                                simpleParser(stream, (err, mail) => {
                                                    let isRead = "unread" , isTrashed = "none";
                                                    if(attrs.flags.includes("\\Seen")){
                                                        isRead = "read";
                                                        isTrashed = "tray";
                                                    }
                                                    const {to, from, subject, text, html, date, attachments, messageId } = mail;
                                                    payload = {date, to: to ? to.text : user.name, from: from.text, subject, text, html,
                                                        r: isRead, t: isTrashed, in:'c', attachments, messageId, attrs};
                                                    data.push(payload);
                                                })
                                            });
                                        });


                                        msg.once('end', async () => {
                                        });
                                    });

                                    //an error occurs on fetching messages
                                    fetchedMessagesEvent.once('error', (err) => {
                                        error = true;
                                        responseCode = 500;
                                        logger.error('Imap Fetch Error :: '+err);
                                        Sentry.captureException(err)
                                    });

                                    //all messages from inbox  are fetched
                                    fetchedMessagesEvent.once('end', () => {
                                        //close inbox and open trashbox
                                        this.imapClient.closeBox((err) => {
                                            if(!err){
                                                //method to get messages from trash box
                                                this.getTrashedMessages(this.imapClient, data, payload);
                                            }
                                        });
                                        //imapClient.end();
                                    })
                                }
                                else{
                                    error = true;
                                }
                            });
                        }


                    });
                
                    this.imapClient.once('error', (err) => {
                        this.imapClient.end();
                        error = true;
                        responseCode = 500;
                        logger.error('imap connection error :: '+err);
                        res.status(responseCode).send({
                            error: true,
                            data: null,
                            message: err
                        });
                        Sentry.captureException(err)

                    });
                    
                    this.imapClient.once('end', () => {
                        if(!res.headersSent)
                        {
                            res.status(responseCode).send({error,
                                total: !error ? data.length : 0,
                                data,
                                message: !error ? status : 'Some error has occured.'
                            });
                        }

                    });

                    //Establish Connection using imap client to an imap server
                    this.imapClient.connect();
                }
                else{
                    responseCode = 400;
                    error = true;
                    res.status(responseCode).send({
                        error,
                        message: "Authentication Error"
                    });
                }
            })
            .catch(err => {
                error = true;
                responseCode = 500;
                res.status(responseCode).send({error, 
                    total: !error ? data.length : 0,
                    data,
                    message: !error ? status : 'Some error has occured.'
                });
                Sentry.captureException(err)
            });
        
    }

    //this method is called after all the messages from inbox are fetched
    getTrashedMessages(imapClient, data, payload){
        this.openMailBox("[Gmail]/Trash", false, (err, box) => {
            if(!err && box.messages?.total){
                let trashedMessagesEvent = imapClient.seq.fetch((box.messages.total)+":1", {
                    bodies: '',
                    struct: true
                });

                //a message is received
                trashedMessagesEvent.on('message', (msg, seqno) => {
                    //message body is loaded
                    msg.on('body', (stream, info) => {
                        
                        //all the data is received from stream
                        stream.once('end', () => {                                
                        })
                        //handling message attributes
                        msg.once('attributes', attrs => {
                            //using mailparser to parse message body
                            simpleParser(stream, (err, mail) => {
                                let isRead = "unread" , isTrashed = "none";
                                if(attrs.flags.includes("\\Seen")){
                                    isRead = "read";
                                    isTrashed = "trash";
                                }
                                const {to, from, subject, text, html, date, attachments, messageId } = mail;
                                payload = {date, to: to ? to.text : 'Mayur Upadhayay', from: from.text, subject, text, html, 
                                    r: isRead, t: isTrashed, in:'c', attachments, messageId, attrs};
                                data.push(payload);
                            })
                        });
                    });
                });

                trashedMessagesEvent.once('end', () => {
                    imapClient.end();
                });
            }
            else{
                imapClient.end();  
            }
        });
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
    
    async deleteEmailMessages(req, res){
        await this.constructIMAP(req, res)

        this.imapClient.once('ready', () => {
            //Opening the Inbox via IMAP
            this.openMailBox('INBOX', false, (err, box) => {
                if(!err){
                    //sets the \Deleted flag on message 
                    this.imapClient.addFlags(req.params.id, 'Deleted', (err) => {
                        //closing the box with autoexpunge parameter = true removes the message 
                        //from mailbox
                        
                        this.imapClient.closeBox(false, err => {
                            if(err) logger.error("Error :: ", err);
                            this.imapClient.end();
                        });
                    });
                }
            });
        });

        this.imapClient.once('error', (err) => {
            this.imapClient.end();
            // error = true;
            // responseCode = 500;
            logger.error('imap connection error :: '+err);
        });
          
        this.imapClient.once('end', () => {
            logger.info("Connection ended");
            // res.status(responseCode).send({error, 
            //     total: !error ? data.length : 0,
            //     data,
            //     message: !error ? status : 'Some error has occured.'
            // });
        });

        this.imapClient.connect();
    }
    
    writeMail(data, isError){
        //Connecttion established
        this.imapClient.once('ready', () => {
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
				if(data.html){
				    msg.body.push(htmlEntity);
                }
                else{
                    msg.body.push(plainEntity);
                }
                this.imapClient.append(msg.toString(), {mailbox: '[Gmail]/Sent Mail'}, (err) => {
                    if(err) isError.error = true;
                    logger.info("Message sent!!!");
                    this.imapClient.end();
                });
        });
        this.imapClient.once('error', (err) => {
            isError.error = true;
        })
        this.imapClient.once('end', () => {
            return;
        })
        //Attempt to connect
        this.imapClient.connect();
    }

    async sendMail(req, res){
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
        if(replyTo || inReplyTo){
            msg = Object.assign({}, msg, {replyTo, inReplyTo});
        }
        let info = await this.transporter.sendMail(msg);
        //writing the sent mail in sender's sent box
        this.writeMail(msg, isError);
        res.send(Object.assign({}, msg, {messageId: info.messageId}, isError));
        //res.send(null);
    }

    async moveMail(req, res){
        await this.constructIMAP(req, res)
        let error = false, message = "success";
        //move message from inbox to trash
        let source = "INBOX", destination = "[Gmail]/Trash";
        //move message from trash to Inbox
        if(req.params.box === "inbox"){
            source = "[Gmail]/Trash";
            destination = "INBOX";
        }
        let mails = req.body;
        this.imapClient.once('ready', () => {
            this.openMailBox(source, false, (err, box) => {
                if(!err && box.messages.total){
                    mails.forEach(mail => {
                        const {from, to, subject, date} = mail;
                        this.imapClient.search([['FROM', this.strip_html(from)], ['TO', this.strip_html(to)], ['SUBJECT', subject], ['ON', date]], (err, results) => {
                            if(!err && results.length){
                                this.imapClient.move(results, destination, err => {
                                    if(!err){
                                        logger.info(`Message move from ${source} to ${destination}`);
                                        this.imapClient.end();
                                    }
                                });
                            }
                            else{
                                error = true;
                                this.imapClient.end();
                            }
                        
                        }) 
                    });    
                }
                else{
                    logger.error(err);
                    this.imapClient.end();
                }
            });
        });

        this.imapClient.once('end', () => {
            res.send({error, message: error ? "Something went wrong. Please contact admin" : message});
        });

        this.imapClient.connect();
    }

    async setFlags(req, res){
        await this.constructIMAP(req, res)
        let error = false, message = "success";
        let flag = "\\"+req.params.flag.charAt(0).toUpperCase()+req.params.flag.slice(1);
        this.imapClient.once('ready', (err) => {
            if(!err){
                this.openMailBox('INBOX', false, (err, box) => {
                    if(!err){
                        //logger.info(box.messages.new);
                        this.imapClient.addFlags(req.params.uid, "\\Seen", () => {
                            //logger.info("Flag added");
                            this.imapClient.end();
                        });
                        //imapClient.end();
                    }
                    else{
                        error = true;
                    }
                });
            }
        });

        this.imapClient.once('end', () => {
            res.send({error, message: error ? "Something went wrong. Please contact admin":message});
        });
        this.imapClient.connect();
    }

    strip_html(str){
      if ((str===null) || (str==='') || str === undefined){
        return '';
      } 
      else{
        str = str.toString();
        return str.replace(/<[^>]*>/g, '').trim();
      }
        
    }

    /**
     * test SMTP connection
     */
    async testSMTPConnection(req, res)
    {
        //console.log("outgoing mail", req.body)
        let secure = false
        if(req.body.smtp_port == 465)
        {
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

            connectionTimeout: 500
        }
        console.log("options", options)
        let connection = new SMTPConnection(options)

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
            res.send({
                status: false,
                data: null,
                message: 'failed'
            })
            Sentry.captureException(err)
        })
        connection.on('end', function () {
            //console.log("connection ended")
        })

        try {
            connection.connect(function (err) {
                //console.log("connection callback", err)

                connection.login({
                    user: req.body.smtp_username,
                    pass: req.body.smtp_password
                }, function(err) {
                    console.log(err)
                    if (err)
                    {
                        res.send({
                            status: false,
                            data: null,
                            message: 'failed'
                        })
                        Sentry.captureException(err)
                    }
                    else
                    {
                        res.send({
                            status: true,
                            data: null,
                            message: 'success'
                        })
                    }

                })
            })

            /*res.send({
                status: true,
                data: null,
                message: 'success'
            })*/

        }
        catch (err) {
            res.send({
                status: false,
                data: null,
                message: 'failed'
            })
            console.log(err)
            logger.error('Error::' + err)
            Sentry.captureException(err)
        }



    }
}

module.exports = new ImapController()