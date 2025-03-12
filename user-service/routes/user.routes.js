// user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/users', userController.registerUser);
router.get('/users', userController.getAllUsers);  // New route for getting all users
router.get('/users/:userId', userController.getUser);
router.put('/users/:userId', userController.updateUser);

module.exports = router;