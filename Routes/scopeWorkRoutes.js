const express = require('express');
const router = express.Router();
const ScopeWorkController = require('../controllers/scopeWorkController');

// Create a new scope work
router.post('/', ScopeWorkController.createScopeWork);

// Get a scope work by ID
router.get('/:id', ScopeWorkController.getScopeWorkById);
//Fetch Scope of Work By ProjectID
router.get('/project/:ProjectId',ScopeWorkController.getScopeWorkByProjectId);
// Update a scope work
router.put('/:id', ScopeWorkController.updateScopeWork);
router.put('/statusUpdate/:id',ScopeWorkController.updateScopeWorkByStatus);
// Delete a scope work
router.delete('/deleteScopeWork/:workId', ScopeWorkController.deleteScopeWork);

// Get all scope work
router.get('/', ScopeWorkController.getAllScopeWork);
router.get('/workName/:id',ScopeWorkController.getWorkName);
router.get('/project/:id', ScopeWorkController.getScopeWorkByProject);


module.exports = router;
