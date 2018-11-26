'use strict'
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Referral', {
    referrerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refereeId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
