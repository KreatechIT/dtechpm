const QCReportController = require('../controllers/QCReportController');

const express = require('express');
const route = express.Router();

route.post('/createQCReport', QCReportController.createQCReport);
route.get('/fetchQCReportByReqID/:RequestedItemID', QCReportController.fetchQCReportByReqID);
route.get('/fetchQCReportByID/:QualityControlReportID', QCReportController.fetchQCReportByID);
route.get('/fetchQCReportByStatus/:MaterialRequisitionID', QCReportController.fetchQCReportByStatus);
route.get('/fetchQCReportByMRID/:MaterialRequisitionID',QCReportController.fetchQCReportByMRID);
route.get('/fetchQCReport_Status_QCID/:QualityControlReportID', QCReportController.fetchQCReport_Status_QCID);
route.put('/updateStatusApproval/:QualityControlReportID', QCReportController.updateStatusApproval);
route.put('/updateQCReportByID/:QualityControlReportID', QCReportController.updateQCReportByID);
route.delete('/deleteQcReportByReqID/:RequestedItemID', QCReportController.deleteQcReportByReqID);

module.exports = route;