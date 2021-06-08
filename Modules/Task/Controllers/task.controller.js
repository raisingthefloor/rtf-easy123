const logger = require('../../../logger/api.logger');
const {Task} = require('../Models/task.model');

class TodoController {

    async getTasks(request, response) {
        try {
            logger.info('Controller: getTasks')
            const tasks = await Task.find({});
            console.log('tasks:::', tasks);
            response.send(tasks);
        } catch (err) {
            logger.error('Error::' + err);
        }


    }

    async createTask(request, response) {
        let data = {};
        try {
            data = await Task.create(request.body);
        } catch (err) {
            logger.error('Error::' + err);
        }
        logger.info('Controller: createTask', data);
        response.send(data);
    }

    async updateTask(request, response) {
        let data = {};
        try {
            data = await Task.updateOne(request.body);
        } catch (err) {
            logger.error('Error::' + err);
        }
        response.send(data);
    }

    async deleteTask(request, response) {

        let data = {};
        try {
            data = await Task.deleteOne({_id: request.params.id});
        } catch (err) {
            logger.error('Error::' + err);
        }
        logger.info('Controller: deleteTask', request.params.id);
        response.send(data.deletedCount > 0);
    }
}

module.exports = new TodoController();