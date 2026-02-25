const AssignWorkerController = require('../controllers/AssignWorkerController');

const express = require('express');
const route = express.Router();

route.post('/createAssign', AssignWorkerController.assignWorker);

route.get('/getWorkerNotAssigned/:projectID', AssignWorkerController.getWorkerNotAssigned);
route.get('/getContractorName/:projectID', AssignWorkerController.getContractorName_PID);
route.get('/getContractorInfo/:projectID', AssignWorkerController.getContractor_PID);
route.get('/getAssignedWorker/:projectID', AssignWorkerController.getAssignedWorkers);

route.put('/updateRating/:assignedWorkerID/:projectID', AssignWorkerController.updateRating);

route.delete('/deleteAssigedWorker/:workerID', AssignWorkerController.deleteAssigned_WID);
route.delete('/deleteAssignedWorkerOne/:assignedWorkerID/:projectID', AssignWorkerController.deleteWorkerByID);
module.exports = route;