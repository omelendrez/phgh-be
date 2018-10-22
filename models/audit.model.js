module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Audit', {
    userId: DataTypes.INTEGER,
    model: DataTypes.STRING,
    recordId: DataTypes.INTEGER,
    field: DataTypes.STRING,
    value: DataTypes.STRING
  })

  Model.prototype.toWeb = function(pw) {
    let json = this.toJSON()
    return json
  }

  return Model
}
