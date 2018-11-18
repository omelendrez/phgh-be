const { Account } = require('../models')

const getUserAccounts = userId => {
  const query =
    'SELECT `id`, `bankCode`, `accountHolderName`, `NUBAN` FROM `accounts` AS `Accounts` WHERE `participantId` = ' +
    userId +
    ';'
  return Account.sequelize.query(query)
}
module.exports.getUserAccounts = getUserAccounts
