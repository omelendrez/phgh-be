const { BitcoinAccount } = require('../models')
const { ReE, ReS } = require('../services/util.service')

const create = async function(req, res) {
  const data = req.body
  BitcoinAccount.create(data)
    .then(account =>
      ReS(
        res,
        {
          message: 'Bitcoin account successfully created',
          account: account.toWeb()
        },
        201
      )
    )
    .catch(err => ReE(res, err, 422))
}
module.exports.create = create

const getAll = (req, res) => {
  const query = `SELECT id, bitcoinAddress, status, createdAt, updatedAt FROM bitcoinaccounts WHERE participantId = ${
    req.params.id
  };`
  const result = { success: true }
  BitcoinAccount.sequelize
    .query(query)
    .then(data => {
      BitcoinAccount.sequelize
        .query(
          `SELECT COUNT(0) as rows FROM bitcoinaccounts WHERE participantId = ${
            req.params.id
          };`
        )
        .then(rows => {
          Object.assign(result, { bitcoinAccounts: data[0], rows: rows[0][0].rows })
          res.json(result)
        })
    })
    .catch(err => ReE(res, err))
}
module.exports.getAll = getAll

const remove = async function(req, res) {
  BitcoinAccount.findOne({ where: { id: req.params.id } })
    .then(account => account.destroy())
    .then(account => {
      ReS(
        res,
        {
          message: `Bitcoin account "${
            account.bitcoinAddress
          }" deleted successfully`,
          account: account.toWeb()
        },
        200
      )
    })
    .catch(() => ReE(res, 'Error occured trying to delete Bitcoin account'))
}
module.exports.remove = remove
