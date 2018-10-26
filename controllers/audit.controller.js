const { Audit } = require('../models')
const { ReE } = require('../services/util.service')

const create = async function(data) {
  Audit.create(data)
}
module.exports.create = create

const getAll = (req, res) => {
  const page = parseInt(req.query.page) - 1
  const query =
    'SELECT `id`, `userId`, `model`, `recordId`, `field`, `value`, `createdAt`, `updatedAt` FROM `audits` ORDER BY id DESC LIMIT ' +
    (page * 10).toString() +
    ',10;'
  const result = { success: true }
  Audit.sequelize
    .query(query)
    .then(data => {
      Audit.sequelize.query('SELECT COUNT(0) as rows FROM `audits`;').then(rows => {
        Object.assign(result, { audit: data[0], rows: rows[0][0].rows })
        res.json(result)
      })
    })
    .catch(err => ReE(res, err))
}
module.exports.getAll = getAll
