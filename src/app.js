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

app.get('/api', (req, res) => {
  api('/v1/cryptocurrency/listings/latest')
    .then((response) => response.data)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

const fxApi = axios.create({
  method: 'GET',
  baseURL: 'https://api.currencybeacon.com',
});

app.get('/usfx', (req, res) => {
  fxApi(
    `/v1/latest?base=USD&symbols=JPY,CHF,CAD&api_key=${process.env.FOREX_API_KEY}`
  )
    .then((response) => response)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

app.get('/aufx', (req, res) => {
  fxApi(`/v1/latest?base=AUD&symbols=USD&api_key=${process.env.FOREX_API_KEY}`)
    .then((response) => response)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

app.get('/nufx', (req, res) => {
  fxApi(`/v1/latest?base=NZD&symbols=USD&api_key=${process.env.FOREX_API_KEY}`)
    .then((response) => response)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

app.get('/gbpfx', (req, res) => {
  fxApi(`/v1/latest?base=GBP&symbols=USD&api_key=${process.env.FOREX_API_KEY}`)
    .then((response) => response)
    .then((value) => res.json(value.data))
    .catch((err) => console.log(err));
});

module.exports = app;
