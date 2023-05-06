const { expect, assert } = require('chai');
const request = require('supertest');
const { Trades } = require('../src/models');
const app = require('../src/app');

describe('/trades', () => {
  before(async () => await Trades.sequelize.sync({ force: true }));

  beforeEach(async () => {
    await Trades.destroy({ where: {} });
  });

  describe('with no trades in the database', () => {
    describe('POST /tradehistory', () => {
      it('creates a new trade in the database', async () => {
        const response = await request(app).post('/tradehistory').send({
          currency_crypto: 'GBP/USD',
          trade_direction: 'Long',
          trade_outcome: 'Win',
          trade_open_date: '2023-05-01',
          trade_open_time: '08:57:00',
          trade_close_date: '2023-05-02',
          trade_close_time: '18:31:00',
          entry_price: '1.2567',
          exit_price: '1.2431',
          observations: 'market news drove down the price',
        });

        const newTradeRecord = await Trades.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(newTradeRecord.currency_crypto).to.equal('GBP/USD');
        expect(newTradeRecord.trade_direction).to.equal('Long');
        expect(newTradeRecord.trade_outcome).to.equal('Win');
        expect(newTradeRecord.trade_open_time).to.equal('08:57:00');
        expect(newTradeRecord.trade_close_date).to.equal('2023-05-02');
        expect(newTradeRecord.trade_close_time).to.equal('18:31:00');
        expect(newTradeRecord.entry_price).to.equal('1.2567');
        expect(newTradeRecord.exit_price).to.equal('1.2431');
        expect(newTradeRecord.observations).to.equal(
          'market news drove down the price'
        );
      });
    });
  });

  describe('with trade records in the database', () => {
    let trades;

    beforeEach(async () => {
      trades = await Promise.all([
        Trades.create({
          currency_crypto: 'NZD/USD',
          trade_direction: 'Long',
          trade_outcome: 'Win',
          trade_open_date: '2023-04-29',
          trade_open_time: '11:30:00',
          trade_close_date: '2023-04-30',
          trade_close_time: '13:05:00',
          entry_price: '1.577',
          exit_price: '1.865',
          observations: 'price broke a resistance level',
        }),
        Trades.create({
          currency_crypto: 'AUD/USD',
          trade_direction: 'Short',
          trade_outcome: 'Lose',
          trade_open_date: '2023-04-25',
          trade_open_time: '08:30:00',
          trade_close_date: '2023-04-30',
          trade_close_time: '10:00:00',
          entry_price: '1000',
          exit_price: '2000',
          observations: 'price broke a support level',
        }),
        Trades.create({
          currency_crypto: 'GBP/USD',
          trade_direction: 'Long',
          trade_outcome: 'Lose',
          trade_open_date: '2023-05-01',
          trade_open_time: '08:57:00',
          trade_close_date: '2023-05-02',
          trade_close_time: '18:31:00',
          entry_price: '1.2567',
          exit_price: '1.2431',
          observations: 'market news drove down the price',
        }),
      ]);
    });

    describe('GET /trades', () => {
      it('gets all trade records', async () => {
        const response = await request(app).get('/tradehistory');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((trade) => {
          const expected = trades.find((a) => a.id === trade.id);

          expect(trade.currency_crypto).to.equal(expected.currency_crypto);
          expect(trade.trade_outcome).to.equal(expected.trade_outcome);
          expect(trade.trade_direction).to.equal(expected.trade_direction);
          expect(trade.trade_open_date).to.equal(expected.trade_open_date);
          expect(trade.trade_open_time).to.equal(expected.trade_open_time);
          expect(trade.trade_close_date).to.equal(expected.trade_close_date);
          expect(trade.trade_close_time).to.equal(expected.trade_close_time);
          expect(trade.entry_price).to.equal(expected.entry_price);
          expect(trade.exit_price).to.equal(expected.exit_price);
          expect(trade.observations).to.equal(expected.observations);
        });
      });
    });

    describe('GET /trades/:id', () => {
      it('gets trade record by id', async () => {
        const trade = trades[0];
        const response = await request(app).get(`/tradehistory/${trade.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.currency_crypto).to.equal(trade.currency_crypto);
        expect(response.body.trade_direction).to.equal(trade.trade_direction);
        expect(response.body.trade_outcome).to.equal(trade.trade_outcome);
        expect(response.body.trade_open_date).to.equal(trade.trade_open_date);
        expect(response.body.trade_open_time).to.equal(trade.trade_open_time);
        expect(response.body.trade_close_date).to.equal(trade.trade_close_date);
        expect(response.body.trade_close_time).to.equal(trade.trade_close_time);
        expect(response.body.entry_price).to.equal(trade.entry_price);
        expect(response.body.exit_price).to.equal(trade.exit_price);
        expect(response.body.observations).to.equal(trade.observations);
      });

      it('returns a 404 if the trade does not exist', async () => {
        const response = await request(app).get('/tradehistory/1987654321');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The trade does not exist.');
      });
    });

    describe('DELETE /tradehistory/:id', () => {
      it('deletes trade record by id', async () => {
        const trade = trades[0];
        const response = await request(app).delete(`/tradehistory/${trade.id}`);
        const deletedTrade = await Trades.findByPk(trade.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedTrade).to.equal(null);
      });

      it('returns a 404 if the trade does not exist', async () => {
        const response = await request(app).delete('/tradehistory/1987654321');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The trade does not exist.');
      });
    });

    describe('PATCH /tradehistory/:id', () => {
      it('updates trade history field by id', async () => {
        const trade = trades[0];
        const response = await request(app)
          .patch(`/tradehistory/${trade.id}`)
          .send({ currency_crypto: 'Bitcoin' });
        const updatedTradeRecord = await Trades.findByPk(trade.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedTradeRecord.currency_crypto).to.equal('Bitcoin');
      });

      it('returns a 404 if the trade does not exist', async () => {
        const response = await request(app)
          .patch('/tradehistory/1987654321')
          .send({ currency_crypto: 'Bitcoin' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The trade does not exist.');
      });
    });

    describe('/tradeHistory validations', () => {
      it('should not allow empty currency_crypto', async () => {
        try {
          await Trades.create({
            currency_crypto: '',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-04-29',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'A currency or crypto must be provided'
          );
        }
      });
      it('should not allow a null value currency_crypto', async () => {
        try {
          await Trades.create({
            currency_crypto: 'Null',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-04-29',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'The currency or crypto cannot be null'
          );
        }
      });

      it('should not allow an empty value for trade_direction', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: '',
            trade_outcome: 'Lose',
            trade_open_date: '2023-04-29',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'A trade direction must be provided'
          );
        }
      });

      it('should only allow a value of long or short for trade_direction', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Null',
            trade_outcome: 'Lose',
            trade_open_date: '2023-04-29',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'Trade direction must either be long or short'
          );
        }
      });

      it('should not allow an empty value for trade_outcome', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: '',
            trade_open_date: '2023-04-29',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'A trade outcome must be provided'
          );
        }
      });

      it('should only allow a value of win or lose for trade_outcome', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-04-29',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'Trade outcome must either be win or lose'
          );
        }
      });
      it('should not allow an empty value for trade_open_date', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-05',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'A trade open date must be provided'
          );
        }
      });
      it('should not allow a trade_open_date value which is in the future', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2050-05-05',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'Trade open date cannot be in the future'
          );
        }
      });
      it('should not allow an empty value for trade_close_date', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-05-01',
            trade_open_time: '13:05:00',
            trade_close_date: '',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'A trade close date must be provided'
          );
        }
      });
      it('should not allow a trade_open_date value which is in the future', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-05-05',
            trade_open_time: '13:05:00',
            trade_close_date: '2050-04-30',
            trade_close_time: '13:05:00',
            entry_price: '1.577',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'Trade close date cannot be in the future'
          );
        }
      });
      it('should not allow an empty value for entry_price', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-04-05',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-29',
            trade_close_time: '13:05:00',
            entry_price: '',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'An entry price must be provided'
          );
        }
      });
      it('should not allow an incorrect format for entry_price', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-05-05',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-29',
            trade_close_time: '13:05:00',
            entry_price: 'text',
            exit_price: '1.55',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'A number must be provided'
          );
        }
      });
      it('should not allow an empty value for exit_price', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-04-05',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-29',
            trade_close_time: '13:05:00',
            entry_price: '1.55',
            exit_price: '',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'An exit price must be provided'
          );
        }
      });
      it('should not allow an incorrect format for exit_price', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-05-05',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-29',
            trade_close_time: '13:05:00',
            entry_price: '1000.4567',
            exit_price: 'text',
            observations: 'This is just a test',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'A number must be provided'
          );
        }
      });
      it('should ensure the observation entered is no longer than 500 characters', async () => {
        try {
          await Trades.create({
            currency_crypto: 'USD/JPY',
            trade_direction: 'Long',
            trade_outcome: 'Lose',
            trade_open_date: '2023-05-05',
            trade_open_time: '13:05:00',
            trade_close_date: '2023-04-29',
            trade_close_time: '13:05:00',
            entry_price: '1000.4567',
            exit_price: '1.55',
            observations:
              'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus',
          });
        } catch (error) {
          assert.strictEqual(error.name, 'SequelizeValidationError');
          assert.strictEqual(
            error.errors[0].message,
            'Entry length cannot exceed 500 characters'
          );
        }
      });
    });
  });
});
