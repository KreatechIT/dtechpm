const ContractorController = require('../controllers/ContractorController');

const express = require('express');
const route = express.Router();

route.post('/createContractor', ContractorController.createContractor);
route.get('/getAllContractor', ContractorController.getAllContractors);
route.get('/getContractorName/:contractorID', ContractorController.getContractorName);
route.get('/getContractorOne/:contractorID', ContractorController.getContractor_CID);

route.put('/updateContractor/:contractorID', ContractorController.updateContractor)

route.delete('/deleteContracter/:contractorID', ContractorController.deleteContracter_ID);
module.exports = route;