const authService = require('../services/auth.service')
const { Audit } = require('../models')
const { to, ReE, ReS } = require('../services/util.service')
const { Participant } = require('../models')

const create = async function (req, res) {
  const body = req.body
  if (!body.unique_key && !body.phone && !body.phone) {
    return ReE(res, 'Please enter an phone or phone number to register.')
  } else if (!body.password) {
    return ReE(res, 'Please enter a password to register.')
  } else {
    let err, participant;
    [err, participant] = await to(authService.createUser(body))
    if (err) return ReE(res, err, 422)
    const audit = {
      participantId: req.participant.id,
      model: 'participants',
      recordId: participant.id,
      field: 'add',
      value: `${participant.username} ${participant.email} (${participant.phone})`
    }
    Audit.create(audit)
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
        const audit = {
          participantId: req.participant.id,
          model: 'participants',
          recordId: participant.id,
          field: 'del',
          value: `${participant.username} ${participant.email} (${participant.phone})`
        }
        Audit.create(audit)
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
  return ReS(res, { message: 'You have successfully signed in', token: participant.getJWT(), participant: participant.toWeb() })
}
module.exports.login = login
