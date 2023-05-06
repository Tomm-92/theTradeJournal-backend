const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const tradesRouter = require('./routes/trades');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/tradehistory', tradesRouter);

module.exports = app;
