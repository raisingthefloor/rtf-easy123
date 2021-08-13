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
const Imap = require('qboxmail-imap')
const { inspect } = require('util');
const logger = require('../../../logger/api.logger')
//const {Buffer} = require('buffer');
const simpleParser = require('mailparser').simpleParser;

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

//Imap connection handler to handle imap connection to remote IMAP server
//Configurations are hard coded for now
const imapClient = new Imap({
    user: 'mayur@raisingthefloor.org',
    password: 'vtjatsvmvtzadkzi',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    },
    authTimeout: 30000
})
let x = []
class ImapController{

    /**Opens a mailbox and processes the passed callback*/
    openMailBox(boxType, callback){
        //openBox(mailboxName, readOnly, callback)
        imapClient.openBox(boxType, true, callback);
    }

    getAllMails(req, res){
        //Variables used for response status and payload
        let error = false, responseCode = 200;
        let data = [], status = 'success', payload = {};

        //Imap Connection is Established
        imapClient.once('ready', () => {
            //Opening the Inbox via IMAP
            this.openMailBox('INBOX', (err, box) => {
                if(!err){
                    let fetchedMessagesEvent = imapClient.seq.fetch('1:*', {
                        bodies: '',
                        struct: true
                    });
        
                    //a message is received
                    fetchedMessagesEvent.on('message', (msg, seqno) => {
                        
                        //message body is loaded
                        msg.on('body', (stream, info) => {
                            let bufferedData = "";
                            //receive data from buffer
                            stream.on('data', async (chunk) => {
                                bufferedData += chunk.toString('utf-8');
                                //parser.write(chunk.toString("utf8"));
                                /*let parsed = await simpleParser(bufferedData);
                                console.log(parsed);*/
                            });
                            //using mailparser to parse message body
                            simpleParser(stream, (err, mail) => {
                                const {to, from, subject, text, html, date, attachments, messageId } = mail;
                                data.push({date, to: to ? to.text : 'Mayur Upadhayay', from: from.text, subject, text, html, 
                                    r:'unread', t:'none', in:'c', attachments, messageId});
                                    //console.log("\n\nMessage starts here =======", inspect(mail));
                            })
                            //all the data is received from stream
                            stream.once('end', () => {
                                /*if(info.which === 'TEXT'){*/
                                    /*bufferedData = Buffer.from(bufferedData.replace(/=([A-Fa-f0-9]{2})/g, function(m, byte) {
                                        return String.fromCharCode(parseInt(byte, 16));
                                    })).toString('utf8');*/
                                    //bufferedData = utf8.decode(quotedPrintable.decode(bufferedData));
                                    /*payload.body = decoder.write(quotedPrintable.decode(bufferedData));
                                    //payload.body = bufferedData;
                                }
                                else{
                                    const {from, to, subject, date} = Imap.parseHeader(bufferedData);
                                    payload.headers = Object.assign({}, {seqno, 
                                        subject: subject[0], to: to[0],
                                        from: from[0], date: date[0]
                                    })*/
                                    /**initializing common properties for mail object
                                     * required on frontend
                                    */
                                    /*payload.r = "unread"
                                    payload.t = "none"
                                    payload.in = "c"
                                }*/
                                
                            })
                        });

                        //handling message attributes
                        msg.once('attributes', attrs => {
                            payload.attributes = attrs;
                            //has a multipart message body
                            /*if(attrs.struct.length > 1){
                                let boundary = attrs.struct[0].params.boundary;
                                let resultantBody = payload.body.split(boundary);
                                let index = resultantBody.length == 2 ? 1 : 2;
                                resultantBody = resultantBody[index];
                                //console.log(resultantBody);
                                //decode only if encoding in a scheme different than 8bit
                                if(1){
                                    resultantBody = quotedPrintable.decode(resultantBody);
                                }
                                payload.body = resultantBody;
                            }
                            else if(attrs.struct.length){
                                payload.body = quotedPrintable.decode(payload.body);
                            }*/
                            
                        });
                        msg.once('end', async () => {
                            //payload.body = await simpleParser(payload.body)
                            //data.push(payload);
                            //payload = {}
                            
                        });
                    });
        
                    //an error occurs on fetching messages
                    fetchedMessagesEvent.once('error', (err) => {
                        error = true;
                        responseCode = 500;
                        logger.error('Imap Fetch Error :: '+err);
                    });
        
                    //all messages are fetched
                    fetchedMessagesEvent.once('end', () => {
                        //parser.end()
                        imapClient.end();
                        /*this.getMsgByUID(55760, function(err, msg) {
                            if (err)
                                throw err;
                            console.log("Completed", inspect(msg, false, 10));
                        });*/
                    })
                }
                else{
                    error = true;
                }
            });
        });
    
        imapClient.once('error', (err) => {
            imapClient.end();
            error = true;
            responseCode = 500;
            logger.error('imap connection error :: '+err);
        });
          
        imapClient.once('end', () => {
            res.status(responseCode).send({error, 
                total: !error ? data.length : 0,
                data,
                message: !error ? status : 'Some error has occured.'
            });
        });

        //Establish Connection using imap client to an imap server
        imapClient.connect();
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
}

module.exports = new ImapController()