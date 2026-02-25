const projectController = require('../controllers/ProjectController');

const express = require('express');
const route = express.Router();
const upload = require('../middleware/upload');

route.post('/create', upload.single('Upload'), projectController.createProject);
route.get('/fetchProject/:projectID', projectController.fetchProjectByID);
route.get('/fetchName/:projectID', projectController.fetchProjectName);
route.get('/fetchAllProjectByStatus', projectController.fetchAllProjectByStatus);
route.put('/updateStatus/:projectID', projectController.updateStatusByProjectID);
route.put('/updateDetails/:projectID', upload.single('file'), projectController.updateProjectDetails);
route.get('/search', projectController.searchProjects);
route.get('/searchLocation', projectController.searchProjectsLocation);

route.get('/fetchAll',projectController.fetchAllProjects);

route.delete('/deleteProject/:projectID', projectController.deleteProject);
module.exports = route;