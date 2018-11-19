module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('UserRole', {
    RoleId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  })
  Model.prototype.toWeb = function(pw) {
    let json = this.toJSON()
    return json
  }
  return Model
}
