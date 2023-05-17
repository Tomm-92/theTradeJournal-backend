const db = require('../models');
const Trades = db.Trades;

const { createReadStream } = require('fs');
const { parse } = require('fast-csv');

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      console.log(req);
      return res.status(400).send('Please upload a CSV file!');
    }

    console.log('params', req.params);
    console.log('fuid', req.body.firebase_uid);

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

module.exports = {
  upload,
};
