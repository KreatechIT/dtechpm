const express = require('express');
const adminController = require('../controllers/adminController');
const upload = require('../middleware/upload'); // Import the upload middleware

const router = express.Router();

router.post('/register', adminController.adminRegistration);
router.post('/login', adminController.adminLogin);
router.put('/update/:AdminID', upload.single('picture'), adminController.adminUpdate);
router.put('/updatePassword/:AdminID', adminController.adminPasswordUpdate);
router.get('/fetchAdmin/:AdminID', adminController.fetchAdminInfo);

module.exports = router;