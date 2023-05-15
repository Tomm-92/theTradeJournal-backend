const Trades = require('../models/trades.js');

const getTrades = (_req, res) => {
  Trades.findAll({
    include: [
      {
        model: Trades,
        as: 'children',
        attributes: [
          'id',
          'currency_crypto',
          'trade_direction',
          'trade_outcome',
          'trade_open_date',
          'trade_open_time',
          'trade_close_date',
          'trade_close_time',
          'entry_price',
          'exit_price',
          'observations',
        ],
        required: true,
      },
    ],
    attributes: {
      exclude: ['firebase_uid'],
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Error while retrieving trades from the database.',
      });
    });
};

module.exports = getTrades;
