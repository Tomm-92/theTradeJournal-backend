module.exports = (connection, DataTypes) => {
  const schema = {
    currency_crypto: DataTypes.STRING,
    trade_direction: DataTypes.STRING,
    trade_outcome: DataTypes.STRING,
    trade_open_date: DataTypes.DATEONLY,
    trade_open_time: DataTypes.TIME,
    trade_close_date: DataTypes.DATEONLY,
    trade_close_time: DataTypes.TIME,
    entry_price: DataTypes.DECIMAL,
    exit_price: DataTypes.DECIMAL,
    observations: DataTypes.STRING,
  };

  const TradesModel = connection.define('Trades', schema);
  return TradesModel;
};
