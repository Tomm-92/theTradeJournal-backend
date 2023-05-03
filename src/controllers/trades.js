const { Trades } = require('../models');

const createTrade = async (req, res) => {
  const newTrade = await Trades.create(req.body);
  res.status(201).json(newTrade);
};

const getAllTrades = async (req, res) => {
  const newTrade = await Trades.findAll();
  res.status(200).json(newTrade);
};

const getTradeById = async (req, res) => {
  try {
    const tradeId = req.params.id;
    const trade = await Trades.findByPk(tradeId);

    if (!trade) {
      res.status(404).json({ error: 'The trade does not exist.' });
    }
    res.status(200).json(trade);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const deleteTradeById = async (req, res) => {
  const { id } = req.params;
  const user = await Trades.findByPk(id);

  try {
    if (user) {
      const deleteTrade = await Trades.destroy({ where: { id } });
      res.status(204).json(deleteTrade);
    } else {
      res.status(404).json({ error: 'The trade does not exist.' });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateTradeRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      currency_crypto,
      trade_open_date,
      trade_open_time,
      trade_close_date,
      trade_close_time,
      entry_price,
      exit_price,
      percentage_gain_loss,
      total_drawdown,
      observations,
    } = req.body;
    const updateData = {
      currency_crypto: currency_crypto,
      trade_open_date: trade_open_date,
      trade_open_time: trade_open_time,
      trade_close_date: trade_close_date,
      trade_close_time: trade_close_time,
      entry_price: entry_price,
      exit_price: exit_price,
      percentage_gain_loss: percentage_gain_loss,
      total_drawdown: total_drawdown,
      observations: observations,
    };

    const [updateRows] = await Trades.update(updateData, { where: { id } });

    if (!updateRows) {
      res.status(404).json({ error: 'The trade does not exist.' });
    }

    res.status(200).json(updateRows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  createTrade,
  getAllTrades,
  getTradeById,
  deleteTradeById,
  updateTradeRecord,
};