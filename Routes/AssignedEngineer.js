const AssignedEngineerController = require('../controllers/AssignEngineerController');
const express = require('express');

const router = express.Router();

router.post('/register', AssignedEngineerController.registerEngineer);

router.get('/fetchAllEngineers', AssignedEngineerController.fetchAllAssignedEngineers);
router.get('/fetchAvailableUsers/:projectID', AssignedEngineerController.fetchAvailableEngineersByProjectID);
router.get('/fetchProjectsByUserID/:userID', AssignedEngineerController.fetchAllProjectsByUserID);
router.get('/fetchAllUsersByProjectID/:projectID', AssignedEngineerController.fetchAllUserByProject);
router.get('/fetchAssignID/:userID/:projectID', AssignedEngineerController.getAssignID_userIDProjectID);
router.get('/fetchAssignIDUserID/:projectID', AssignedEngineerController.fetchAssignedAndUserID_ProjectID);
router.get('/fetchUserIDName/:assignID', AssignedEngineerController.fetchUserIDName_AssignID)

router.delete('/deleteAllAssigned/:projectID', AssignedEngineerController.deleteAllAssignedByProjectID);
router.delete('/deleteSpecificAssigned/:userID/:projectID', AssignedEngineerController.deleteOneAssigned);
router.delete('/deleteAllAssignedByUser/:userID', AssignedEngineerController.deleteAllAssignedByUser);

module.exports = router;