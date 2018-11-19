const { Account } = require('../models')
const { ReE, ReS } = require('../services/util.service')

const create = async function(req, res) {
  const data = req.body
  Account.create(data)
    .then(account =>
      ReS(
        res,
        {
          message: 'Account successfully created',
          account: account.toWeb()
        },
        201
      )
    )
    .catch(err => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {
  const query = `SELECT id, bankCode, accountHolderName, NUBAN, status, createdAt, updatedAt FROM accounts WHERE participantId = ${
    req.params.id
  } ORDER BY bankCode, NUBAN;`
  const result = { success: true }
  Account.sequelize
    .query(query)
    .then(data => {
      Account.sequelize
        .query(
          `SELECT COUNT(0) as rows FROM accounts WHERE participantId = ${
            req.params.id
          };`
        )
        .then(rows => {
          Object.assign(result, { accounts: data[0], rows: rows[0][0].rows })
          res.json(result)
        })
    })
    .catch(err => ReE(res, err))
}
module.exports.getAll = getAll
