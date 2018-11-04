const { User, Participant } = require('../models')
const validator = require('validator')
const { to, TE } = require('../services/util.service')

const getUniqueKeyFromBody = function (body) { // this is so they can send in 3 options unique_key, email, or phone and it will work
  let unique_key = body.username
  if (typeof unique_key === 'undefined') {
    if (typeof body.email != 'undefined') {
      unique_key = body.email
    } else if (typeof body.phone != 'undefined') {
      unique_key = body.phone
    } else {
      unique_key = null
    }
  }
  return unique_key
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody

const createUser = async (userInfo) => {
  let unique_key, auth_info, err, user
  auth_info = {}
  auth_info.status = 'create'
  unique_key = getUniqueKeyFromBody(userInfo)
  if (!unique_key) TE('An email or phone number was not entered.')
  if (validator.isEmail(unique_key)) {
    auth_info.method = 'email'
    userInfo.email = unique_key;
    [err, user] = await to(User.create(userInfo))
    if (err) TE(err.message)
    return user
  } else if (validator.isMobilePhone(unique_key, 'any')) { // checks if only phone number was sent
    auth_info.method = 'phone'
    userInfo.phone = unique_key;
    [err, user] = await to(User.create(userInfo))
    if (err) TE('User already exists with that phone number')
    return user
  } else {
    TE('A valid email or phone number was not entered.')
  }
}
module.exports.createUser = createUser

const createParticipant = async (participantInfo) => {
  let unique_key, auth_info, err, participant
  auth_info = {}
  auth_info.status = 'create'

  unique_key = participantInfo.username
  if (validator.isAlphanumeric(unique_key)) {
    auth_info.method = 'username';
    [err, participant] = await to(Participant.create(participantInfo))
    if (err) TE(err.message)
    return participant
  } else {
    TE('A valid username was not entered.')
  }

  unique_key = participantInfo.email
  if (validator.isEmail(unique_key)) {
    auth_info.method = 'email';
    [err, participant] = await to(Participant.create(participantInfo))
    if (err) TE(err.message)
    return participant
  } else {
    TE('A valid email was not entered.')
  }

  unique_key = participantInfo.phone
  if (validator.isMobilePhone(unique_key, 'any')) { // checks if only phone number was sent
    auth_info.method = 'phone';
    [err, participant] = await to(Participant.create(participantInfo))
    if (err) TE('Participant already exists with that phone number')
    return participant
  } else {
    TE('A valid phone number was not entered.')
  }

  if (!unique_key) TE('A username, email or mobile was not entered.')

}
module.exports.createParticipant = createParticipant

const authUser = async function (userInfo) {
  let unique_key, err
  let auth_info = {}
  auth_info.status = 'login'
  unique_key = getUniqueKeyFromBody(userInfo)
  if (!unique_key) TE('Please enter an email to login')
  if (!userInfo.password) TE('Please enter a password to login')
  let user
  if (validator.isEmail(unique_key)) {
    auth_info.method = 'email';
    [err, user] = await to(User.findOne({ where: { email: unique_key } }))
    if (err) TE(err.message)
  } else if (validator.isMobilePhone(unique_key, 'any')) { // checks if only phone number was sent
    auth_info.method = 'phone';
    [err, user] = await to(User.findOne({ where: { phone: unique_key } }))
    if (err) TE(err.message)
  } else {
    TE('Please provide a valid email')
  }
  if (!user) TE('This email address is not registered');
  [err, user] = await to(user.comparePassword(userInfo.password))
  if (err) TE(err.message)
  return user
}
module.exports.authUser = authUser

const authParticipant = async function (participantInfo) {
  let unique_key, err, participant
  let auth_info = {}
  auth_info.status = 'login'

  if (!participantInfo.password) TE('Please enter a password to login')

  if (participantInfo.username) {
    unique_key = participantInfo.username
    auth_info.method = 'username'
    if (validator.isAlphanumeric(unique_key)) {
      [err, participant] = await to(Participant.findOne({ where: { username: unique_key } }))
      if (err) TE(err.message)
    } else {
      TE('Please provide a valid username')
    }
  }

  if (participantInfo.email) {
    unique_key = participantInfo.email
    auth_info.method = 'email'
    if (validator.isEmail(unique_key)) {
      [err, participant] = await to(Participant.findOne({ where: { email: unique_key } }))
      if (err) TE(err.message)
    } else {
      TE('Please provide a valid email')
    }
  }

  if (participantInfo.phone) {
    unique_key = participantInfo.phone
    auth_info.method = 'phone'
    if (validator.isMobilePhone(unique_key, 'any')) {
      [err, participant] = await to(Participant.findOne({ where: { phone: unique_key } }))
      if (err) TE(err.message)
    } else {
      TE('Please provide a valid phone')
    }
  }

  if (!unique_key) TE('Please enter username,  email or mobile to login')

  if (!participant) TE(`This ${auth_info.method} is not registered`);

  [err, participant] = await to(participant.comparePassword(participantInfo.password))

  if (err) TE(err.message)

  return participant
}
module.exports.authParticipant = authParticipant

const confirmParticipant = async function (data) {
  let err, user
  [err, user] = await to(Participant.findOne({ where: { uid: data.uid } }))
  if (err) TE(err.message)
  if (!user) TE('Sorry, the verification link is not valid');
  [err, user] = await to(user.update({ emailVerified: 1 }))
  if (err) TE(err.message)
  return user
}
module.exports.confirmParticipant = confirmParticipant
