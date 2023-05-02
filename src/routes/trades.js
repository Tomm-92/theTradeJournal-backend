const express = require('express');
const router = express.Router();
const tradesController = require('../controllers/trades');

router.post('/', tradesController.createTrade);
router.get('/', tradesController.getAllTrades);
router.get('/:id', tradesController.getTradeById);
router.delete('/:id', tradesController.deleteTradeById);
router.patch('/:id', tradesController.updateTradeRecord);

module.exports = router;
