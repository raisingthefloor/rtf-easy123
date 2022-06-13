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
const {User} = require('../../Auth/Models/user.model')
const Sentry = require("@sentry/node")

class UserController {
    /**
     * get all non deleted users
     * @param request
     * @param response json data of users
     * @returns {Promise<void>}
     */
    async getUsers(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }

        try {

            let retUsers = []
            let total = await User.countDocuments({
                deleted: false,
                role: {$in: ["admin", "assistant"]}
            })

            let users = await User.find({
                deleted: false,
                role: {$in: ["admin", "assistant"]}
            })
                .sort({
                role: 1,
                updatedAt: -1
            })
                .limit(request.body.tableConfig.perPage)
                .skip(request.body.tableConfig.perPage * (request.body.tableConfig.page-1))

            for (let i = 0; i < users.length; i++) {
                if (users[i].role == "assistant")
                {
                    let tempObj = {}
                    let user = await User.findOne({
                        createdBy: users[i]._id,
                        role: "user"
                    })
                    if(user)
                    {
                        //tempObj.id = users[i].id
                        tempObj.name = users[i].name
                        tempObj.email = users[i].email
                        tempObj.id = users[i].id
                        tempObj.account_name = user.name
                        tempObj.account_nickname = user.nickname
                        //console.log(tempObj)
                        tempObj.role = "Assistant/User"
                        retUsers.push(tempObj)
                    }

                }
                else {
                    users[i].role = "Admin"
                    retUsers.push(users[i])
                }
            }

            data.status = true
            data.data = {
                users: retUsers,
                total: total
            }


            response.send(data)
        } catch (err) {
            console.log(err)
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            //data.error = err
            data.message = 'failed'

            response.send(data)
        }
    }

    /**
     * delete the user with id
     * @param request
     * @param response json data of users
     * @returns {Promise<void>}
     */
    async deleteUser(request, response) {
        let data = {
            status: false,
            data: [],
            message: ''
        }
        try {
            //find one
            let user = await User.findOne({
                _id:request.body.id
            }).exec()

            if(user.role == "assistant")
            {
                //soft delete user created by this assistant
                let createdUser = await User.findOne({
                    createdBy: user.id,
                    deleted: false,
                    role: 'user'
                })
                await createdUser.softdelete()
            }

            //soft delete
            user = await user.softdelete()

            data.status = true
            data.data = await User.find({deleted:false})

            response.send(data)
        } catch (err) {
            Sentry.captureException(err)
            logger.error('Error::' + err)

            data.status = false
            data.data = null
            //data.error = err
            data.message = 'failed'

            response.send(data)
        }
    }
}

module.exports = new UserController()