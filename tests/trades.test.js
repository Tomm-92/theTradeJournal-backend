const { expect } = require('chai');
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
          trade_open_date: '2023-05-01',
          trade_open_time: '08:57:00',
          trade_close_date: '2023-05-02',
          trade_close_time: '18:31:00',
          entry_price: '1.2567',
          exit_price: '1.2431',
          percentage_gain_loss: '1.08',
          total_drawdown: '50',
          observations: 'market news drove down the price',
        });

        const newTradeRecord = await Trades.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(newTradeRecord.currency_crypto).to.equal('GBP/USD');
        expect(newTradeRecord.trade_open_date).to.equal('2023-05-01');
        expect(newTradeRecord.trade_open_time).to.equal('08:57:00');
        expect(newTradeRecord.trade_close_date).to.equal('2023-05-02');
        expect(newTradeRecord.trade_close_time).to.equal('18:31:00');
        expect(newTradeRecord.entry_price).to.equal('1.2567');
        expect(newTradeRecord.exit_price).to.equal('1.2431');
        expect(newTradeRecord.percentage_gain_loss).to.equal('1.08');
        expect(newTradeRecord.total_drawdown).to.equal('50');
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
          trade_open_date: '2023-04-29',
          trade_open_time: '11:30:00',
          trade_close_date: '2023-04-30',
          trade_close_time: '13:05:00',
          entry_price: '1.577',
          exit_price: '1.865',
          percentage_gain_loss: '18.26',
          total_drawdown: '25',
          observations: 'price broke a resistance level',
        }),
        Trades.create({
          currency_crypto: 'AUD/USD',
          trade_open_date: '2023-04-25',
          trade_open_time: '08:30:00',
          trade_close_date: '2023-04-30',
          trade_close_time: '10:00:00',
          entry_price: '1000',
          exit_price: '2000',
          percentage_gain_loss: '100',
          total_drawdown: '50',
          observations: 'price broke a support level',
        }),
        Trades.create({
          currency_crypto: 'GBP/USD',
          trade_open_date: '2023-05-01',
          trade_open_time: '08:57:00',
          trade_close_date: '2023-05-02',
          trade_close_time: '18:31:00',
          entry_price: '1.2567',
          exit_price: '1.2431',
          percentage_gain_loss: '1.08',
          total_drawdown: '50',
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
          expect(trade.trade_open_date).to.equal(expected.trade_open_date);
          expect(trade.trade_open_time).to.equal(expected.trade_open_time);
          expect(trade.trade_close_date).to.equal(expected.trade_close_date);
          expect(trade.trade_close_time).to.equal(expected.trade_close_time);
          expect(trade.entry_price).to.equal(expected.entry_price);
          expect(trade.exit_price).to.equal(expected.exit_price);
          expect(trade.percentage_gain_loss).to.equal(
            expected.percentage_gain_loss
          );
          expect(trade.total_drawdown).to.equal(expected.total_drawdown);
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
        expect(response.body.trade_open_date).to.equal(trade.trade_open_date);
        expect(response.body.trade_open_time).to.equal(trade.trade_open_time);
        expect(response.body.trade_close_date).to.equal(trade.trade_close_date);
        expect(response.body.trade_close_time).to.equal(trade.trade_close_time);
        expect(response.body.entry_price).to.equal(trade.entry_price);
        expect(response.body.exit_price).to.equal(trade.exit_price);
        expect(response.body.percentage_gain_loss).to.equal(
          trade.percentage_gain_loss
        );
        expect(response.body.total_drawdown).to.equal(trade.total_drawdown);
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
  });
});
