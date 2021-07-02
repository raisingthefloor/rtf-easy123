const logger = require('../../../logger/api.logger');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis')
const {User} = require('../../Googleapi/Models/user.model')
//const toBlobURL = require('stream-to-blob-url')

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
        //console.log("data", request.decoded)
        try {
            data.status = true
            data.data = await User.find({deleted: false})
            //console.log('users:::', data.data);
            response.send(data)
        } catch (err) {
            logger.error('Error::' + err)
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
            let user = await User.findOne({_id:request.body.id}).exec()

            //soft delete
            user = await user.softdelete()

            data.status = true
            data.data = await User.find({deleted:false})

            response.send(data)
        } catch (err) {
            logger.error('Error::' + err)
            response.send(data)
        }
    }
}

module.exports = new UserController()