'use strict'
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Account', {
    participantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bankCode: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    accountHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name of Account Holder is a mandatory field' }
      }
    },
    NUBAN: {
      type: DataTypes.STRING(10),
      isNumeric: true,
      allowNull: false,
      validate: {
        len: { args: [10, 10], msg: 'NUBAN must contain 10 digits' },
        notEmpty: { msg: 'NUBAN is a mandatory field' }
      },
      unique: {
        args: 'uniqueKey',
        msg: 'NUBAN already registered in our database'
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
