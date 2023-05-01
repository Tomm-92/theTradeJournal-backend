module.exports = (connection, DataTypes) => {
  const schema = {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email_address: DataTypes.STRING,
    password: DataTypes.STRING,
  };

  const UsersModel = connection.define('Users', schema);
  return UsersModel;
};
