const ArrivalStatusController = require('../controllers/ArrivalStatusController');

const express = require ('express');
const route = express.Router();

route.post('/createArrivalStatus', ArrivalStatusController.createArrivalStatus);
route.get('/fetchByMRID/:MaterialRequisitionID', ArrivalStatusController.fetchByMRID);
route.put('/updateArrivalStatusByReqID/:RequestedItemID', ArrivalStatusController.updateArrivalStatusByReq)

module.exports = route;