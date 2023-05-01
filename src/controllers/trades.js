const { Trades } = require('../models');

const createTrade = async (req, res) => {
  const newTrade = await Trades.create(req.body);
  res.status(201).json(newTrade);
};

module.exports = { createTrade };
