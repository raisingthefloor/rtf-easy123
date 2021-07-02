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

