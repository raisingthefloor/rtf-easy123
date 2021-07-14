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
const { body, validationResult } = require('express-validator')
const {User} = require('../Models/user.model')

const createUser = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                User.findOne({email:req.body.email}, function(err, user){
                    if(err) {
                        reject(new Error('Server Error'))
                    }
                    if(Boolean(user)) {
                        reject(new Error('E-mail already in use'))
                    }
                    resolve(true)
                });
            });
        }),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be 8 character long'),

    body('confirmedPassword', 'Passwords do not match')
        .exists(),
        //.custom((value, { req }) => value === req.body.password),
    (req, res, next) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                data: errors.array()
            });
        }
        else next();
    }
]

module.exports = {
    createUser
}

