const { expect, assert } = require('chai');
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
          password: 'Secretpassword1#',
        });

        const newUserRecord = await Users.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.first_name).to.equal('John');
        expect(response.body.last_name).to.equal('Doe');
        expect(response.body.email_address).to.equal('JohnDoe@gmail.com');
        expect(response.body.password).to.equal('Secretpassword1#');
        expect(newUserRecord.first_name).to.equal('John');
        expect(newUserRecord.last_name).to.equal('Doe');
        expect(newUserRecord.email_address).to.equal('JohnDoe@gmail.com');
        expect(newUserRecord.password).to.equal('Secretpassword1#');
      });
    });
  });

  describe('with users in the database', () => {
    let users;
    beforeEach(async () => {
      users = await Promise.all([
        Users.create({
          first_name: 'John',
          last_name: 'Doe',
          email_address: 'JohnDoe@gmail.com',
          password: 'Secretpassword1#',
        }),
        Users.create({
          first_name: 'Jane',
          last_name: 'Doe',
          email_address: 'JaneDoe@gmail.com',
          password: 'Secretpassword1#',
        }),
        Users.create({
          first_name: 'Jimmy',
          last_name: 'Hendrix',
          email_address: 'JimmyHendrix@gmail.com',
          password: 'Secretpassword1#',
        }),
      ]);
    });

    describe('GET /users', () => {
      it('gets all users records', async () => {
        const response = await request(app).get('/users');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((user) => {
          const expected = users.find((a) => a.id === user.id);

          expect(user.user).to.equal(expected.user);
        });
      });
    });

    describe('GET users/:id', () => {
      it('gets an author by id', async () => {
        const user = users[0];
        const response = await request(app).get(`/users/${user.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.user).to.equal(user.user);
      });

      it('returns a 404 if the user does not exist', async () => {
        const response = await request(app).get('/users/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The user could not be found.');
      });
    });

    describe('DELETE users/:id', () => {
      it('deletes a user by id', async () => {
        const user = users[0];
        const response = await request(app).delete(`/users/${user.id}`);
        const deletedUser = await Users.findByPk(user.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedUser).to.equal(null);
      });

      it('returns a 404 if the user does not exist', async () => {
        const response = await request(app).delete('/users/12345');

        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User not found');
      });
    });

    describe('PATCH users/:id', () => {
      it('updates a user by id', async () => {
        const user = users[0];
        const response = await request(app)
          .patch(`/users/${user.id}`)
          .send({ email_address: 'anewemail@gmail.com' });
        const updatedUserRecord = await Users.findByPk(user.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedUserRecord.email_address).to.equal('anewemail@gmail.com');
      });

      it('returns a 404 if the user does not exist', async () => {
        const response = await request(app)
          .patch('/users/12345')
          .send({ email: 'anewemail@gmail.com' });

        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User not found');
      });
    });
  });
});

describe('/users validations', () => {
  it('should not allow empty first_name', async () => {
    try {
      await Users.create({
        first_name: '',
        last_name: 'Doe',
        email_address: 'john.doe@example.com',
        password: 'Abc@1234',
      });
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
      assert.strictEqual(
        error.errors[0].message,
        'First name must only contain letters and spaces'
      );
      assert.strictEqual(
        error.errors[1].message,
        'First name length must be between 1 and 50 characters'
      );
    }
  });

  it('should not allow empty last_name', async () => {
    try {
      await Users.create({
        first_name: 'John',
        last_name: '',
        email_address: 'john.doe@example.com',
        password: 'Abc@1234',
      });
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
      assert.strictEqual(
        error.errors[0].message,
        'Last name must only contain letters and spaces'
      );
      assert.strictEqual(
        error.errors[1].message,
        'Last name length must be between 1 and 50 characters'
      );
    }
  });

  it('should ensure email is of correct type', async () => {
    try {
      await Users.create({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john.doeexample.com',
        password: 'Abc@1234',
      });
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
      assert.strictEqual(
        error.errors[0].message,
        'Invalid email address format'
      );
    }
  });

  it('should ensure password is at least 6 characters long, and has one uppercase letter, number, and special character', async () => {
    try {
      await Users.create({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john.doe@example.com',
        password: 'abc34',
      });
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
      assert.strictEqual(
        error.errors[0].message,
        'Password must be at least 6 characters long'
      );
      assert.strictEqual(
        error.errors[1].message,
        'Password must contain at least one uppercase letter and one special character'
      );
    }
  });
});
