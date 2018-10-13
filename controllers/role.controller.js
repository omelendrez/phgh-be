const { Role } = require('../models')
const { ReE, ReS } = require('../services/util.service')

const create = async function (req, res) {
    const data = req.body
    Role
        .create(data)
        .then(data => {
            Object.assign(data, { roles: data[0] })
            ReS(res, { message: `Successfully created new role: "${data.name}"`, role: data.toWeb() }, 201)
        })
        .catch(err => {
            return ReE(res, err)
        })
}
module.exports.create = create

const getAll = (req, res) => {
    const query = 'SELECT * FROM `Roles` AS `Role`;'
    const result = { success: true }
    Role
        .sequelize
        .query(query)
        .then(data => {
            Object.assign(result, { roles: data[0] })
            res.json(result)
        })
        .catch(err => {
            return ReE(res, err)
        })
}

module.exports.getAll = getAll

const get = function (req, res) {
    let role = req.role

    return ReS(res, { role: role.toWeb() })
}
module.exports.get = get

const update = async function (req, res) {
    let data
    data = req.body
    Role.findOne({ where: { id: data.id } })
        .then(role => role.update({
            name: data.name
        })
        )
        .then(role =>
            ReS(res, { message: `Role "${role.name}" updated successfully`, role: role.toWeb() }, 201)
        )
        .catch(() => ReE(res, 'Error occured trying to update role'))
}
module.exports.update = update

const remove = async function (req, res) {
    let data
    data = req.body
    Role.findOne({ where: { id: data.id } })
        .then(role => role.destroy()
            .then(role => ReS(res, { message: `Role "${role.name}" successfully deleted`, role: role.toWeb() }, 201)
            )
        )
        .catch(() => ReE(res, 'Error occured trying to delete role'))
}
module.exports.remove = remove
