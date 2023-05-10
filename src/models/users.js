module.exports = (connection, DataTypes) => {
  const schema = {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[\p{L}\p{M}\s]+$/u,
          msg: 'First name must only contain letters and spaces',
        },
        len: {
          args: [1, 50],
          msg: 'First name length must be between 1 and 50 characters',
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[\p{L}\p{M}\s]+$/u,
          msg: 'Last name must only contain letters and spaces',
        },
        len: {
          args: [1, 50],
          msg: 'Last name length must be between 1 and 50 characters',
        },
      },
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email address format',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    firebase_uid: {
      type: DataTypes.STRING,
    },
  };

  const UsersModel = connection.define('Users', schema);
  return UsersModel;
};
