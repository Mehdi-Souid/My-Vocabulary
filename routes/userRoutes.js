const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 

router.post('/users', userController.createUser);// Create a new user
router.get('/users', userController.getUsers);// Get all users
router.get('/users/:id', userController.getUserById);// Get a user by ID
router.put('/users/:id', userController.updateUser);// Update a user
router.delete('/users/:id', userController.deleteUser);// Delete a user
router.post('/signin', userController.signInUser);
module.exports = router;
