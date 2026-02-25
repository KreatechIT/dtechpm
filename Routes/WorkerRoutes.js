const WorkerController = require('../controllers/WorkerController');

const express = require('express')
const route = express.Router();

route.post('/createWorker', WorkerController.createWorker);

route.get('/getAllWorkers', WorkerController.getWorkerAll);
route.get('/getWorkerbyCID/:ContractorID', WorkerController.getWorkersByCID);
route.get('/getWorker/:workerID', WorkerController.getWorker_WID);

route.put('/updateWorkerWID/:workerID', WorkerController.updateWorker);

route.delete('/deleteWorker/:workerID', WorkerController.deleteWorker_WID);

module.exports = route