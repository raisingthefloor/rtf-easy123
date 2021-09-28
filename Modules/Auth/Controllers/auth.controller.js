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
const {User} = require('../Models/user.model')
const {Token} = require('../Models/token.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const Sentry = require("@sentry/node")

/**
 * manage authentication
 */
class AuthController {
    /**
     * login user
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async login( request, response) {

        try {
            const user = await User.findOne({
                email: request.body.email,
                deleted: false
            })

            if(!user)
            {
                response.status(404).send({
                    status: false,
                    data: null,
                    message: 'User not found'
                })
            }

            bcrypt.compare(request.body.password, user.password)
                .then(match => {
                    if(match)
                    {
                        //check if email is verified
                        if(user.role != "user" && !user.emailVerified)
                        {
                            response.send({
                                status: false,
                                data: {
                                    email: user.email
                                },
                                message: "NOT_VERIFIED"
                            })
                            return
                        }
                        // Create a jwt token
                        const payload = {
                            id: user._id
                        };
                        const options = {
                            expiresIn: '364d',
                            issuer: process.env.FRONT_URL
                        }
                        const secret = process.env.JWT_SECRET
                        const token = jwt.sign(payload, secret, options)

                        response.send({
                            status: true,
                            data: {
                                name: user.name,
                                email: user.email,
                                googleEmail: user.googleEmail,
                                token: token,
                                role: user.role
                            }
                        })
                    }
                    else
                    {
                        response.status(401).send({
                            status: false,
                            data: null,
                            message: 'Please enter correct email or password'
                        })
                    }
                })

            //console.log('users:::', users);
            //response.send(user);
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)

            response.send({
                status: false,
                data: 'Server error occurred, please contact administrator.',
                error: err,
                message: 'failed'
            })
        }
    }

    /**
     * register new user
     * @param request
     * @param response
     * @returns json response
     */
    async register( request, response) {
        try {
            //there()
            const saltRounds = 10
            let data = {}
            const { account_name, account_nickname, email, password, name } = request.body

            let hash = await bcrypt.hash(password, saltRounds)

            // Store hash in your password DB.
            data = await User.create({
                name: name,
                email: email,
                password: hash,
                role: 'assistant'
            })
            //console.log("data", data)
            //create a user
            let account_user = await User.create({
                name: account_name,
                nickname: account_nickname,
                createdBy: data._id
            })

            // generate token and save
            let token = await Token.create({
                _userId: data._id,
                token: crypto.randomBytes(16).toString('hex')
            })

            //send mail mailjet
            const mailjet = require('node-mailjet').connect(
                process.env.MJ_APIKEY_PUBLIC,
                process.env.MJ_APIKEY_PRIVATE
            )

            const mailRequest = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: process.env.MJ_SENDER_EMAIL,
                            Name: process.env.MJ_SENDER_NAME,
                        },
                        To: [
                            {
                                Email: data.email,
                                Name: data.name,
                            },
                        ],
                        Subject: 'Email Verification - Easy123',
                        TextPart: 'Greetings from Mailjet!',
                        HTMLPart: 'Hello '+ data.name + ',<br><br>' + 'Please verify your account by clicking the link: <a href="'+process.env.FRONT_URL+'confirmation\/'+data.email+'\/'+token.token+'">Verify Email</a><br><br>Thank You!<br>Easy123 Team'
                    },
                ],
            })

            mailRequest
                .then(result => {
                    //console.log(result.body)
                })
                .catch(err => {
                    console.log(err.statusCode)
                })

            // Create a jwt token
            const payload = {
                id: data._id
            };
            const options = {
                expiresIn: '364d',
                issuer: process.env.FRONT_URL
            }
            const secret = process.env.JWT_SECRET
            const jwtToken = jwt.sign(payload, secret, options)

            //console.log('users:::', users);
            response.send({
                status: true,
                data: {
                    name: data.name,
                    email: data.email,
                    googleEmail: data.googleEmail,
                    token: jwtToken,
                    role: data.role
                },
                message: 'success'
            })
        } catch (err) {
            logger.error('Error::' + err);

            Sentry.captureException(err)

            response.send({
                status: false,
                data: 'Server error occurred, please contact administrator.',
                error: err,
                message: 'failed'
            })

        }
    }

    /**
     * email confirmation
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async confirmation(request, response) {
        try {
            let { email, token } = request.body
            token = await Token.findOne({ token: token })

            if(!token)
            {
                response.send({
                    status: false,
                    data: [],
                    message: "Link is expired"
                })
                return
            }

            let user = await User.findOne({
                _id: token._userId,
                email: email,
                deleted: false
            })

            if(!user)
            {
                response.send({
                    status: false,
                    data: [],
                    message: "User not found"
                })
                return
            }

            if(user.isVerified)
            {
                response.send({
                    status: false,
                    data: [],
                    message: "User is already verified"
                })
                return
            }

            user.emailVerified = true
            user.save()

            token.delete()

            response.send({
                status: true,
                data: [],
                message: "Email verified"
            })
            return
        }
        catch (err)
        {
            logger.error('Error::' + err)
            Sentry.captureException(err)
            response.send({
                status: false,
                data: 'Server error occurred, please contact administrator.',
                error: err,
                message: 'failed'
            })
        }
    }

    /**
     * resend verification email
     */
    async resendVerificationEmail(request, response) {
        //get user with email
        const user = await User.findOne({
            email: request.body.email
        })

        if(!user)
        {
            response.status(404).send({
                status: false,
                data: null,
                message: 'user_not_found'
            })
        }
        let data = user

        // generate token and save
        let token = await Token.create({
            _userId: data._id,
            token: crypto.randomBytes(16).toString('hex')
        })

        //send mail mailjet
        const mailjet = require('node-mailjet').connect(
            process.env.MJ_APIKEY_PUBLIC,
            process.env.MJ_APIKEY_PRIVATE
        )

        const mailRequest = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MJ_SENDER_EMAIL,
                        Name: process.env.MJ_SENDER_NAME,
                    },
                    To: [
                        {
                            Email: data.email,
                            Name: data.name,
                        },
                    ],
                    Subject: 'Email Verification - Easy123',
                    TextPart: 'Greetings from Mailjet!',
                    HTMLPart: 'Hello '+ data.name + ',<br><br>' + 'Please verify your account by clicking the link: <a href="'+process.env.FRONT_URL+'confirmation\/'+data.email+'\/'+token.token+'">Verify Email</a><br><br>Thank You!<br>Easy123 Team'
                },
            ],
        })

        mailRequest
            .then(result => {
                //console.log(result.body)
            })
            .catch(err => {
                console.log(err.statusCode)
            })

        response.send({
            status: true,
            data: {
            },
            message: 'success'
        })
    }

    /**
     * check if email exists
     */
    async checkIfEmailExists(request, response) {
        try {
            if(!request.query.email)
            {
                response.send({
                    status: true,
                    data: null,
                    message: 'user_exists'
                })
                return
            }

            const user = await User.findOne({
                _id: { $ne: request.query.id },
                email: request.query.email,
                deleted: false
            })

            if(!user)
            {
                response.send({
                    status: true,
                    data: null,
                    message: 'user_not_exists'
                })
                return
            }
            else {
                response.send({
                    status: true,
                    data: null,
                    message: 'user_exists'
                })
                return
            }

            //console.log('users:::', users);
            //response.send(user);
        } catch (err) {
            logger.error('Error::' + err)
            Sentry.captureException(err)
            response.send({
                status: false,
                data: null,
                message: 'failed'
            })
        }


    }
}

module.exports = new AuthController();