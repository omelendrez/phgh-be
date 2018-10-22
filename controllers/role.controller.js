const { Role } = require('../models')
const { Audit } = require('../models')
const { UserRole } = require('../models')
const { ReE, ReS } = require('../services/util.service')

const create = async function (req, res) {
    const data = req.body
    Role
        .create(data)
        .then(data => {
            Object.assign(data, { roles: data[0] })
            const audit = {
              userId: req.user.id,
              model: 'roles',
              recordId: data.id,
              field: 'add',
              value: data.name
            }
            Audit.create(audit)

            ReS(res, { message: `Successfully created new role: "${data.name}"`, role: data.toWeb() }, 201)
        })
        .catch(err => {
            return ReE(res, err)
        })
}
module.exports.create = create

const createUserRole = async function (req, res) {
    const data = req.body
    const UserId = data.UserId || data[0].UserId
    UserRole
        .destroy({ where: { UserId: UserId } })
        .then(() => {
            UserRole
                .bulkCreate(data)
                .then(data => {
                    Object.assign(data, { userRoles: {} })
                    ReS(res, { message: 'Successfully created new user role', roles: data.toWeb() }, 201)
                })
                .catch(err => ReE(res, 'Error occured trying to update user roles [Step 2]'))

        })
        .catch(err => ReE(res, 'Error occured trying to update user roles [Step 1]'))
}
module.exports.createUserRole = createUserRole

const getAll = (req, res) => {
    const query = 'SELECT `id`, `name`, `createdAt`, `updatedAt` FROM `Roles` AS `Role`;'
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

const getUserRoles = (req, res) => {

    const query = 'SELECT `UserId`, `RoleId` FROM `UserRoles` AS `UserRole` WHERE `UserId` = ' + req.params.id + ';'
    const result = { success: true }
    UserRole
        .sequelize
        .query(query)
        .then(data => {
            Object.assign(result, { userRoles: data[0] })
            res.json(result)
        })
        .catch(err => {
            return ReE(res, err)
        })
}
module.exports.getUserRoles = getUserRoles

const get = function (req, res) {
    let role = req.role
    return ReS(res, { role: role.toWeb() })
}
module.exports.get = get

const update = async function (req, res) {
    let data
    data = req.body
    Role.findOne({ where: { id: req.params.id } })
        .then(role => role.update({
            name: data.name
        })
        )
        .then(role => {
          const audit = {
            userId: req.user.id,
            model: 'roles',
            recordId: role.id,
            field: 'upd',
            value: role.name
          }
          Audit.create(audit)
          ReS(res, { message: `Role "${role.name}" updated successfully`, role: role.toWeb() }, 201)
        })
        .catch(() => ReE(res, 'Error occured trying to update role'))
}
module.exports.update = update

const remove = async function (req, res) {
    Role.findOne({ where: { id: req.params.id } })
        .then(role => role.destroy()
            .then(role => {
              const audit = {
                userId: req.user.id,
                model: 'roles',
                recordId: role.id,
                field: 'del',
                value: role.name
              }
              Audit.create(audit)
                ReS(res, { message: `Role "${role.name}" successfully deleted`, role: role.toWeb() }, 201)
            })
        )
        .catch(() => ReE(res, 'Error occured trying to delete role'))
}
module.exports.remove = remove
