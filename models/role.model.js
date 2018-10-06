module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Role', {
    name: DataTypes.STRING
  })

  Model.associate = function (models) {
    this.Users = this.belongsToMany(models.User, { through: 'UserRole' })
  }

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON()
    return json
  }

  return Model
}
