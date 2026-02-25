const MaterialRequisitionController = require ('../controllers/MaterialRequisitionController');

const express = require ('express');
const route = express.Router();

route.post('/createRequisition', MaterialRequisitionController.createRequisition);
// route.get('/getProjectEngineerByMRID/:MaterialRequisitionID', MaterialRequisitionController.getAllByMRID);
route.get('/getAllByMRID/:MaterialRequisitionID', MaterialRequisitionController.getAllByMRID);
route.get('/getAllMRbyProjectID/:ProjectID', MaterialRequisitionController.getAllMRbyProjectID);
route.get('/getMAByProject_Status/:ProjectID', MaterialRequisitionController.fetchMAByProject_Status);
route.put('/updateRequisitionStatus/:MaterialRequisitionID', MaterialRequisitionController.updateRequisitionStatus);
route.delete('/deleteMR_MRID/:MaterialRequisitionID', MaterialRequisitionController.deleteMR_MRID);

module.exports = route;