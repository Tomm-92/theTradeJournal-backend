module.exports = (connection, DataTypes) => {
  const schema = {
    currency_crypto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'A currency or crypto must be provided',
        },
        notNull: {
          args: [true],
          msg: 'A currency or crypto must be provided',
        },
      },
    },
    trade_direction: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'A trade direction must be provided',
        },
        notNull: {
          args: [true],
          msg: 'A trade direction must be provided',
        },
        isIn: {
          args: [['Long', 'Short']],
          msg: 'Trade direction must either be long or short',
        },
      },
    },
    trade_outcome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'A trade outcome must be provided',
        },
        notNull: {
          args: [true],
          msg: 'A trade outcome must be provided',
        },
        isIn: {
          args: [['Win', 'Lose']],
          msg: 'Trade outcome must either be win or lose',
        },
      },
    },
    trade_open_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'A trade open date must be provided',
        },
        notNull: {
          args: [true],
          msg: 'A trade open date must be provided',
        },
        isDate: {
          args: [true],
          msg: 'Must be a valid date of format YYYY-MM-DD',
        },
        customValidator(value) {
          if (new Date(value) > new Date()) {
            throw new Error('Trade open date cannot be in the future');
          }
        },
      },
    },
    trade_open_time: {
      type: DataTypes.TIME,
    },
    trade_close_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'A trade close date must be provided',
        },
        isDate: {
          args: [true],
          msg: 'Must be a valid date of format YYYY-MM-DD',
        },
        notNull: {
          args: [true],
          msg: 'A trade close date must be provided',
        },
        customValidator(value) {
          if (new Date(value) > new Date()) {
            throw new Error('Trade close date cannot be in the future');
          }
        },
      },
    },
    trade_close_time: {
      type: DataTypes.TIME,
    },
    entry_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'An entry price must be provided',
        },
        notNull: {
          args: [true],
          msg: 'An entry price must be provided',
        },
        isDecimal: {
          args: [true],
          msg: 'A number must be provided',
        },
      },
    },
    exit_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'An exit price must be provided',
        },
        notNull: {
          args: [true],
          msg: 'An exit price must be provided',
        },
        isDecimal: {
          args: [true],
          msg: 'A number must be provided',
        },
      },
    },
    observations: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Entry length cannot exceed 500 characters',
        },
      },
    },
  };

  const TradesModel = connection.define('Trades', schema);

  return TradesModel;
};
