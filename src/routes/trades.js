const express = require('express');
const router = express.Router();
const tradesController = require('../controllers/trades');

router.post('/', tradesController.createTrade);

module.exports = router;
