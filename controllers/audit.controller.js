const { Audit } = require('../models')
const { ReE } = require('../services/util.service')

const create = async function (data) {
  const { userId, model, recordId, field, value } = data
  Audit.create(data)
}
module.exports.create = create

const getAll = (req, res) => {
  const query =
    'SELECT `id`, `userId`, `model`, `recordId`, `field`, `value`, `createdAt`, `updatedAt` FROM `audits`; '
  const result = { success: true }
  Audit.sequelize
    .query(query)
    .then(data => {
      Object.assign(result, { audit: data[0] })
      res.json(result)
    })
    .catch(err => ReE(res, err))
}
module.exports.getAll = getAll
