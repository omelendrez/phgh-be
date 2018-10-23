module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Holiday', {
        date: DataTypes.DATE,
        title: DataTypes.STRING
    })

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON()
        return json
    }

    return Model
}
