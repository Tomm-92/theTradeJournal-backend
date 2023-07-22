const express = require('express');
const router = express.Router();
const tradesController = require('../controllers/trades');
const csvController = require('../controllers/csv.controller.js');
const getTrades = require('../controllers/trades.controller.js');
const uploadFile = require('../middleware/upload.js');
require('dotenv').config();

const isAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === process.env.TRADES_API_KEY) {
    next();
  } else {
    res.status(401);
    res.send('Access denied');
  }
};

router.get('/', isAuth, tradesController.getAllTrades);
router.post('/', isAuth, tradesController.createTrade);
router.get('/', isAuth, tradesController.getAllTrades);
router.get('/:id', isAuth, tradesController.getTradeById);
router.delete('/:id', isAuth, tradesController.deleteTradeById);
router.patch('/:id', isAuth, tradesController.updateTradeRecord);
router.post('/csv/upload', uploadFile.single('file'), csvController.upload);
router.get('/', getTrades);

module.exports = router;
