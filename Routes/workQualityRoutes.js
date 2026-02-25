const express = require('express');
const router = express.Router();
const WorkQualityController = require('../controllers/workQualityController');

// Create a new work quality
router.post('/', WorkQualityController.createWorkQuality);

// Get a work quality by ID
router.get('/getWorkByID/:id', WorkQualityController.getWorkQualityById);

// Update a work quality
router.put('/updateWorkQuality/:id', WorkQualityController.updateWorkQuality);

// Delete a work quality
router.delete('/deleteWorkQualityID/:id', WorkQualityController.deleteWorkQuality);

// Get all work quality
router.get('/getAllWorkQuality', WorkQualityController.getAllWorkQuality);

// Get work quality by project ID

router.get('/project/:id', WorkQualityController.getWorkQualityByProject);

router.get('/getWorkQualityByScopeWorkID/:scopeWorkID', WorkQualityController.getWorkQualityByScopeWorkID);

module.exports = router;
