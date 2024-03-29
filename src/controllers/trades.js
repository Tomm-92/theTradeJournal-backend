const { Trades } = require('../models');

const createTrade = async (req, res) => {
  try {
    const newTrade = await Trades.create(req.body);
    res.status(201).json(newTrade);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const getAllTrades = async (req, res) => {
  try {
    const firebaseUid = req.query.firebase_uid;
    const newTrade = await Trades.findAll({
      where: { firebase_uid: firebaseUid },
    });

    if (newTrade.length === 0) {
      return res
        .status(404)
        .json({ error: 'No trades found for the specific user.' });
    }

    res.status(200).json(newTrade);
  } catch (e) {
    res.status(500).json(e.message);
  }
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
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const updateTradeRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      currency_crypto,
      trade_direction,
      trade_outcome,
      trade_open_date,
      trade_open_time,
      trade_close_date,
      trade_close_time,
      entry_price,
      exit_price,
      observations,
      fireBaseId,
    } = req.body;
    const updateData = {
      currency_crypto: currency_crypto,
      trade_direction: trade_direction,
      trade_outcome: trade_outcome,
      trade_open_date: trade_open_date,
      trade_open_time: trade_open_time,
      trade_close_date: trade_close_date,
      trade_close_time: trade_close_time,
      entry_price: entry_price,
      exit_price: exit_price,
      observations: observations,
      fireBaseId: fireBaseId,
    };

    const [updateRows, trades] = await Trades.update(updateData, {
      where: { id },
      returning: true,
    });

    if (!updateRows) {
      res.status(404).json({ error: 'The trade does not exist.' });
    }

    res.status(200).json(trades[0]);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = {
  createTrade,
  getAllTrades,
  getTradeById,
  deleteTradeById,
  updateTradeRecord,
};
