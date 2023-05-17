const express = require('express');
const router = express.Router();
const tradesController = require('../controllers/trades');
const csvController = require('../controllers/csv.controller.js');
const getTrades = require('../controllers/trades.controller.js');
const uploadFile = require('../middleware/upload.js');

router.post('/', tradesController.createTrade);
router.get('/', tradesController.getAllTrades);
router.get('/:id', tradesController.getTradeById);
router.delete('/:id', tradesController.deleteTradeById);
router.patch('/:id', tradesController.updateTradeRecord);
router.post('/csv/upload', uploadFile.single('file'), csvController.upload);
router.get('/', getTrades);

module.exports = router;
