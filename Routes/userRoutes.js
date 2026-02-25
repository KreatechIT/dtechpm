// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Import the upload middleware

// Register a new user
router.post('/register', upload.single('photo'), UserController.registerUser);
// Login user
router.post('/login', UserController.loginUser);

// Update user with file upload middleware
router.put('/:id', upload.single('Photo'), UserController.editUser);
// Delete user
router.delete('/:userId', UserController.deleteUser);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Get all users
router.get('/', UserController.getAllUsers);


// update password with email
router.put('/:id/password-and-email', UserController.updatePasswordAndEmail);


module.exports = router;
