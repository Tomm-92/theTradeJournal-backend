const { Users } = require('../models');

const createUser = async (req, res) => {
  const newUser = await Users.create(req.body);
  res.status(201).json(newUser);
};

module.exports = { createUser };
