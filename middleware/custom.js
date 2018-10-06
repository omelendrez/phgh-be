const Role = require('./../models').Role;
const { to, ReE, ReS } = require('../services/util.service');

let role = async function (req, res, next) {
    let role_id, err, role;
    role_id = req.params.role_id;

    [err, role] = await to(Role.findOne({ where: { id: role_id } }));
    if (err) return ReE(res, "err finding role");

    if (!role) return ReE(res, "Role not found with id: " + role_id);
    let user, users_array, users;
    user = req.user;
    [err, users] = await to(role.getUsers());

    users_array = users.map(obj => String(obj.user));

    if (!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: " + app_id);

    req.role = role;
    next();
}
module.exports.role = role;
