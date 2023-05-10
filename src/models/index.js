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

  Trades.belongsTo(Users, {
    foreignKey: 'firebase_uid',
  });
  Users.hasMany(Trades, {
    foreignKey: 'firebase_uid',
  });

  connection.sync({ alter: true });
  return {
    Users,
    Trades,
  };
};

module.exports = setupDatabase();
