const taskController = require('./Controllers/task.controller')

module.exports = function (router) {
    router.get('/api/tracecenter/tasks', taskController.getTasks)
    router.post('/api/tracecenter/task', taskController.createTask)
    router.put('/api/tracecenter/task', taskController.updateTask)
    router.delete('/api/tracecenter/task/:id', taskController.deleteTask)
    //router.delete('/connect', gmailController.getMails)
}