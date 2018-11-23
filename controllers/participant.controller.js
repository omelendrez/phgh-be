const authService = require('../services/auth.service')
const { to, ReE, ReS } = require('../services/util.service')
const { Participant, Account } = require('../models')

const create = async (req, res) => {
  const body = req.body
  if (!body.unique_key && !body.email && !body.phone) {
    return ReE(
      res,
      'Please enter a username, email or phone number to register.'
    )
  } else if (!body.password) {
    return ReE(res, 'Please enter a password to register.')
  } else {
    let err, participant
    ;[err, participant] = await to(authService.createParticipant(body))
    if (err) return ReE(res, err, 422)
    sendEmail(participant.username, participant.email, participant.uid)
    return ReS(
      res,
      {
        message: `Successfully created new participant: "${
          participant.username
        } ${participant.email}"`,
        user: participant.toWeb(),
        token: participant.getJWT()
      },
      201
    )
  }
}
module.exports.create = create

const getAll = (req, res) => {
  const query =
    'SELECT `id`, `username`,`email`,`phone`,`createdAt`,`updatedAt` FROM Participants;'
  const result = { success: true }
  Participant.sequelize
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

const remove = async (req, res) => {
  Participant.findOne({ where: { id: req.params.id } })
    .then(participant =>
      participant.destroy().then(participant => {
        ReS(res, {
          message: `Participant "${participant.username} ${
            participant.email
          }" deleted successfully`,
          participant: participant.toWeb()
        })
      })
    )
    .catch(() => ReE(res, 'Error occured trying to delete participant'))
}
module.exports.remove = remove

const login = async (req, res) => {
  let err, participant, account
  ;[err, participant] = await to(authService.authParticipant(req.body))
  if (err) return ReE(res, err, 422)
  ;[err, account] = await to(
    Account.findAll({ where: { participantId: participant.id } })
  )
  if (err) return ReE(res, err, 404)
  const { username, email, uid } = participant
  if (!participant.emailVerified && !participant.phoneVerified) {
    const subject = 'FITTOC - Email verification'
    let message = require('./../templates/templates.json').confirmEmail
    message = message.split('{{username}}').join(username)
    message = message.split('{{email}}').join(email)
    message = message.split('{{uid}}').join(uid)

    sendEmail(message, subject, username, email)
    return ReE(
      res,
      {
        message:
          'Your account exits in the database but your email address and phone number have not been verified yet, therefore you are not allowed to access until those verifications are complete. A new email has been just sent to the registered email address in order for you to confirm it'
      },
      422
    )
  }
  return ReS(res, {
    message: 'You have successfully signed in',
    token: participant.getJWT(),
    user: participant.toWeb(),
    accounts: account
  })
}
module.exports.login = login

const sendEmail = (message, subject, username, email) => {
  const nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fittoc.nigeria',
      pass: 'P5d6eyrk*%HS'
    }
  })
  const mailOptions = {
    from: '"FITTOC" <fittoc.nigeria@gmail.com>',
    to: `"${username}" <${email}>`,
    bcc: 'fittoc.nigeria@gmail.com',
    subject: subject,
    html: message,
    attachments: [
      {
        filename: 'android-icon-96x96.png',
        path: 'https://fittoc.herokuapp.com/img/icons/android-icon-96x96.png',
        cid: 'logo' //same cid value as in the html img src
      }
    ]
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

const confirm = async function(req, res) {
  let err, participant
  ;[err, participant] = await to(authService.confirmParticipant(req.body))
  if (err) return ReE(res, err, 422)
  return ReS(res, {
    message: 'You have successfully confirmed your email address',
    token: participant.getJWT(),
    user: participant.toWeb()
  })
}
module.exports.confirm = confirm

const forgotPassword = async (req, res) => {
  let err, participant
  ;[err, participant] = await to(authService.getParticipantInfo(req.body))
  if (err) return ReE(res, err, 422)

  const { username, email, uid } = participant
  const subject = 'FITTOC - Reset password'
  let message = require('./../templates/templates.json').forgotPassword
  message = message.split('{{username}}').join(username)
  message = message.split('{{uid}}').join(uid)
  sendEmail(message, subject, username, email)

  return ReS(res, {
    message: 'Please check your email inbox',
    user: participant.toWeb()
  })
}
module.exports.forgotPassword = forgotPassword

const resetPassword = async function(req, res) {
  let err, participant
  ;[err, participant] = await to(authService.resetPasswordParticipant(req.body))
  if (err) return ReE(res, err, 422)
  return ReS(res, {
    message: 'You have successfully changed your password',
    token: participant.getJWT(),
    user: participant.toWeb()
  })
}
module.exports.resetPassword = resetPassword

