const express = require('express');
const axios = require('axios');
const cors = require('cors');
const usersRouter = require('./routes/users');
const tradesRouter = require('./routes/trades');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', usersRouter);
app.use('/tradehistory', tradesRouter);

const api = axios.create({
  method: 'GET',
  baseURL: 'https://pro-api.coinmarketcap.com',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
    Accept: 'application/json',
    'Accept-Encoding': 'deflate, gzip',
  },
});

const newsapi = axios.create({
  method: 'GET',
  baseURL: 'https://api.newscatcherapi.com/',
  headers: {
    'x-api-key': process.env.NEWSCATCHER_API_KEY,
    Accept: 'application/json',
    'Accept-Encoding': 'deflate, gzip',
  },
});

app.get('/api', (req, res) => {
  api('/v1/cryptocurrency/listings/latest')
    .then((response) => response.data)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

app.get('/newsapi', (req, res) => {
  newsapi(`/v2/latest_headlines`)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

module.exports = app;
