const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

const isAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === process.env.USERS_API_KEY) {
    next();
  } else {
    res.status(401);
    res.send('Access denied');
  }
};

router.delete('/:id', isAuth, usersController.deleteUser);

router.get('/', isAuth, usersController.getUsers);

router.get('/:id', isAuth, usersController.getUserById);

router.patch('/:id', isAuth, usersController.updateUser);

router.post('/', usersController.createUser);

module.exports = router;
