const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.delete('/:id', usersController.deleteUser);

router.get('/', usersController.getUsers);

router.get('/:id', usersController.getUserById);

router.patch('/:id', usersController.updateUser);

router.post('/', usersController.createUser);

module.exports = router;
