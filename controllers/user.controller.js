const authService = require('../services/auth.service')
const { Audit } = require('../models')
const { to, ReE, ReS } = require('../services/util.service')
const { User } = require('../models')

const create = async function (req, res) {

    const body = req.body

    if (!body.unique_key && !body.email && !body.phone) {
        return ReE(res, 'Please enter an email or phone number to register.')
    } else if (!body.password) {
        return ReE(res, 'Please enter a password to register.')
    } else {
        let err, user;

        [err, user] = await to(authService.createUser(body))

        if (err) return ReE(res, err, 422)

        const audit = {
          userId: req.user.id,
          model: 'users',
          recordId: user.id,
          field: 'add',
          value: `${user.first} ${user.last} (${user.email})`
        }
        Audit.create(audit)

        return ReS(res, { message: `Successfully created new user: "${user.first} ${user.last}"`, user: user.toWeb(), token: user.getJWT() }, 201)
    }
}
module.exports.create = create

const get = async function (req, res) {
    let user = req.user

    return ReS(res, { user: user.toWeb() })
}
module.exports.get = get

const getAll = (req, res) => {
    const query = 'SELECT `id`, `first`,`last`,`email`,`phone`,`createdAt`,`updatedAt`FROM Users;'

    const result = { success: true }
    User
        .sequelize
        .query(query)
        .then(data => {
            Object.assign(result, { users: data[0] })
            res.json(result)
        })
        .catch(err => {
            return ReE(res, err)
        })
}

module.exports.getAll = getAll

const update = async function (req, res) {
    let data
    data = req.body
    User.findOne({ where: { id: data.id } })
        .then(user => user.update({
            first: data.first,
            last: data.last,
            phone: data.phone,
            email: `${user.first} ${user.last} (${user.email})`
        })
        )
        .then(user => ReS(res, { message: `User "${user.first} ${user.last}" successfully updated`, user: user.toWeb() }, 201))
        .catch(() => ReE(res, 'Error occured trying to update user'))
}
module.exports.update = update

const remove = async function (req, res) {
    User.findOne({ where: { id: req.params.id } })
        .then(user => user.destroy()
            .then(user => {
              const audit = {
                userId: req.user.id,
                model: 'users',
                recordId: user.id,
                field: 'del',
                value: `${user.first} ${user.last} (${user.email})`
              }
              Audit.create(audit)

              ReS(res, { message: `User "${user.first} ${user.last}" deleted successfully`, user: user.toWeb() })
            })
        )
        .catch(() => ReE(res, 'Error occured trying to delete user'))
}
module.exports.remove = remove
/*
const remove = async function (req, res) {
    let user, err
    user = req.user;

    [err, user] = await to(user.destroy())
    if (err) return ReE(res, 'error occured trying to delete user')

    return ReS(res, { message: 'Deleted User' }, 204)
}
module.exports.remove = remove
*/
const login = async function (req, res) {
    let err, user;

    [err, user] = await to(authService.authUser(req.body))
    if (err) return ReE(res, err, 422)

    return ReS(res, { message: 'You have successfully signed in', token: user.getJWT(), user: user.toWeb() })
}
module.exports.login = login
