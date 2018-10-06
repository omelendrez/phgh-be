const { Role } = require('../models')
const { to, ReE, ReS } = require('../services/util.service')

const create = async function (req, res) {
    let err, role
    let user = req.user

    let role_info = req.body;

    [err, role] = await to(Role.create(role_info))
    if (err) return ReE(res, err, 422)

    role.addUser(user, { through: { status: 'started' } });

    [err, role] = await to(role.save())
    if (err) return ReE(res, err, 422)

    let role_json = role.toWeb()
    role_json.users = [{ user: user.id }]

    return ReS(res, { role: role_json }, 201)
}
module.exports.create = create

const getAll = async function (req, res) {
    let user = req.user
    let err, roles;

    [err, roles] = await to(user.getRoles({ include: [{ association: Role.Users }] }))

    let roles_json = []
    for (let i in roles) {
        let role = roles[i]
        let users = role.Users
        let role_info = role.toWeb()
        let users_info = []
        for (let i in users) {
            let user = users[i]
            // let user_info = user.toJSON();
            users_info.push({ user: user.id })
        }
        role_info.users = users_info
        roles_json.push(role_info)
    }

    console.log('c t', roles_json)
    return ReS(res, { roles: roles_json })
}
module.exports.getAll = getAll

const get = function (req, res) {
    let role = req.role

    return ReS(res, { role: role.toWeb() })
}
module.exports.get = get

const update = async function (req, res) {
    let err, role, data
    role = req.role
    data = req.body
    role.set(data);

    [err, role] = await to(role.save())
    if (err) {
        return ReE(res, err)
    }
    return ReS(res, { role: role.toWeb() })
}
module.exports.update = update

const remove = async function (req, res) {
    let role, err
    role = req.role;

    [err, role] = await to(role.destroy())
    if (err) return ReE(res, 'error occured trying to delete the role')

    return ReS(res, { message: 'Deleted Role' }, 204)
}
module.exports.remove = remove
