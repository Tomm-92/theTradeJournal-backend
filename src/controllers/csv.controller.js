const Trades = require('../models/trades.js');
const { createReadStream } = require('fs');
const { parse } = require('fast-csv');
const { Parser: CsvParser } = require('json2csv');

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send('Please upload a CSV file!');
    }

    let trades = [];
    let path = './resources/static/assets/uploads/' + req.file.filename;

    createReadStream(path)
      .pipe(parse({ headers: true }))
      .on('error', (error) => {
        throw error.message;
      })
      .on('data', (row) => {
        trades.push(row);
      })
      .on('end', () => {
        Trades.bulkCreate(trades)
          .then(() => {
            res.status(200).send({
              message:
                'The file: ' +
                req.file.originalname +
                ' got uploaded successfully!!',
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Couldn't import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Failed to upload the file: ' + req.file.originalname,
    });
  }
};

const download = (_req, res) => {
  Trades.findAll().then((objs) => {
    let trades = [];

    objs.forEach((obj) => {
      const {
        id,
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
      } = obj;
      trades.push({
        id,
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
      });
    });

    const csvFields = [
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
    ];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(trades);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=trades.csv');

    res.status(200).end(csvData);
  });
};

module.exports = {
  upload,
  download,
};
