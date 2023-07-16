const { Users, Trades } = require('../models');

const createUser = async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const getUsers = async (req, res) => {
  const auth = req.headers.authorization;
  if (auth === 'passwordtest') {
    try {
      const users = await Users.findAll();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401);
    res.send('Access forbidden');
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, {
      attributes: { exclude: 'password' },
      include: {
        model: Trades,
        attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] },
      },
    });
    if (user == null) {
      res.status(404).json({ error: `The user could not be found.` });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email_address, password } = req.body;

    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await user.update({
      first_name,
      last_name,
      email_address,
      password,
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await Users.destroy({ where: { id } });

    if (!deletedRows) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createUser, deleteUser, getUsers, getUserById, updateUser };
