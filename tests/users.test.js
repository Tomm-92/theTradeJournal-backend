const { expect } = require('chai');
const request = require('supertest');
const { Users } = require('../src/models');
const app = require('../src/app');

describe('/users', () => {
  before(async () => await Users.sequelize.sync({ force: true }));

  beforeEach(async () => {
    await Users.destroy({ where: {} });
  });

  describe('with no users in the database', () => {
    describe('POST /users', () => {
      it('creates a new user in the database', async () => {
        const response = await request(app).post('/users').send({
          first_name: 'John',
          last_name: 'Doe',
          email_address: 'JohnDoe@gmail.com',
          password: 'secretpassword',
        });

        const newUserRecord = await Users.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.first_name).to.equal('John');
        expect(response.body.last_name).to.equal('Doe');
        expect(response.body.email_address).to.equal('JohnDoe@gmail.com');
        expect(response.body.password).to.equal('secretpassword');
        expect(newUserRecord.first_name).to.equal('John');
        expect(newUserRecord.last_name).to.equal('Doe');
        expect(newUserRecord.email_address).to.equal('JohnDoe@gmail.com');
        expect(newUserRecord.password).to.equal('secretpassword');
      });
    });
  });
});
