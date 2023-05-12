const express = require('express');
const axios = require('axios');
const cors = require('cors');
const usersRouter = require('./routes/users');
const tradesRouter = require('./routes/trades');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
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
app.get('/api', (req, res) => {
  api('/v1/cryptocurrency/listings/latest')
    .then((response) => response.data)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

const apiFx = axios.create({
  baseURL: 'https://api.currencybeacon.com/v1/',
});
const endpoint = 'live';
const api_key = 'test';

app.get('/apifx', (req, res) => {
  apiFx
    .get(`latest/${endpoint}?api_key=${api_key}`)
    .then((response) => response.data)
    .then((value) => res.json(value.data))
});

module.exports = app;
