const dailyProgressController = require('../controllers/DailyProgressController');

const express = require ('express');
const route = express.Router();

route.post('/logProgress', dailyProgressController.logProgress);

module.exports = route