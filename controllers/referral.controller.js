const { Referral } = require('../models')
const { ReE } = require('../services/util.service')

const create = async function(data) {
  Referral.create(data)
}
module.exports.create = create

const getAll = (req, res) => {
  const query = `SELECT p.username, p.email, p.phone, p.createdAt FROM referrals AS r INNER JOIN participants AS p ON r.refereeId = p.id WHERE r.referrerId = ${
    req.params.id
  } ORDER BY r.id`
  const result = { success: true }
  Referral.sequelize
    .query(query)
    .then(data => {
      Object.assign(result, {
        referrals: data[0],
        rows: data[0].length
      })
      res.json(result)
    })
    .catch(err => ReE(res, err))
}
module.exports.getAll = getAll
