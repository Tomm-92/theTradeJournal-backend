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
          trade_open_date: '2022-04-25',
          trade_open_time: '08:30:00',
          trade_close_date: '2022-04-30',
          trade_close_time: '10:00:00',
          entry_price: '1000',
          exit_price: '2000',
          percentage_gain_loss: '100',
          total_drawdown: '50',
          observations: 'price broke a support level',
        });

        const newTradeRecord = await Trades.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(newTradeRecord.currency_crypto).to.equal('GBP/USD');
        expect(newTradeRecord.trade_open_date).to.equal('2022-04-25');
        expect(newTradeRecord.trade_open_time).to.equal('08:30:00');
        expect(newTradeRecord.trade_close_date).to.equal('2022-04-30');
        expect(newTradeRecord.trade_close_time).to.equal('10:00:00');
        expect(newTradeRecord.entry_price).to.equal('1000');
        expect(newTradeRecord.exit_price).to.equal('2000');
        expect(newTradeRecord.percentage_gain_loss).to.equal('100');
        expect(newTradeRecord.total_drawdown).to.equal('50');
        expect(newTradeRecord.observations).to.equal(
          'price broke a support level'
        );
      });
    });
  });
});
