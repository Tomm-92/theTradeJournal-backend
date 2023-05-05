const Sequelize = require('sequelize');
const UsersModel = require('./users');
const TradesModel = require('./trades');

const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: PGPORT,
    dialect: 'postgres',
    logging: false,
  });

  const Users = UsersModel(connection, Sequelize);
  const Trades = TradesModel(connection, Sequelize);

  Users.hasMany(Trades);
  Trades.belongsTo(Users);

  connection.sync({ alter: true });
  return {
    Users,
    Trades,
  };
};

module.exports = setupDatabase();
