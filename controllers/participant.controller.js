const authService = require('../services/auth.service')
const { to, ReE, ReS } = require('../services/util.service')
const { Participant } = require('../models')

const create = async function (req, res) {
  const body = req.body
  if (!body.unique_key && !body.email && !body.phone) {
    return ReE(res, 'Please enter a username, email or phone number to register.')
  } else if (!body.password) {
    return ReE(res, 'Please enter a password to register.')
  } else {
    let err, participant;
    [err, participant] = await to(authService.createParticipant(body))
    if (err) return ReE(res, err, 422)
    return ReS(res, { message: `Successfully created new participant: "${participant.username} ${participant.email}"`, participant: participant.toWeb(), token: participant.getJWT() }, 201)
  }
}
module.exports.create = create

const getAll = (req, res) => {
  const query = 'SELECT `id`, `username`,`email`,`phone`,`createdAt`,`updatedAt` FROM Participants;'
  const result = { success: true }
  Participant
    .sequelize
    .query(query)
    .then(data => {
      Object.assign(result, { participants: data[0] })
      res.json(result)
    })
    .catch(err => {
      return ReE(res, err)
    })
}
module.exports.getAll = getAll

const remove = async function (req, res) {
  Participant.findOne({ where: { id: req.params.id } })
    .then(participant => participant.destroy()
      .then(participant => {
        ReS(res, { message: `Participant "${participant.username} ${participant.email}" deleted successfully`, participant: participant.toWeb() })
      })
    )
    .catch(() => ReE(res, 'Error occured trying to delete participant'))
}
module.exports.remove = remove

const login = async function (req, res) {
  let err, participant;
  [err, participant] = await to(authService.authParticipant(req.body))
  if (err) return ReE(res, err, 422)
  if(!participant.emailVerified && !participant.phoneVerified ) return ReE(res, {message: 'Your account exits in the database but your email address and phone number have not been verified yet, therefore you are not allowed to access until those verifications are complete'}, 422)
  return ReS(res, { message: 'You have successfully signed in', token: participant.getJWT(), user: participant.toWeb() })
}
module.exports.login = login
