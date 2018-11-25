'use strict'
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('BitcoinAccount', {
    participantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bitcoinAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [26, 35],
          msg: 'Bitcoin address must have between 25 and 35 characters'
        },
        notEmpty: { msg: 'Bitcoin address is a mandatory field' }
      },
      unique: {
        args: 'uniqueKey',
        msg: 'Bitcoin address already registered in our database'
      }
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    }
  })

  Model.prototype.toWeb = function(pw) {
    let json = this.toJSON()
    return json
  }

  return Model
}
