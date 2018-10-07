const { to, ReE, ReS } = require('../services/util.service')

const Dashboard = function (req, res) {
	let user = req.user.id
	return res.json({ success: true, message: 'It worked', data: 'User name is :' })
}
module.exports.Dashboard = Dashboard
