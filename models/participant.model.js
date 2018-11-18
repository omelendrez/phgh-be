'use strict'
const bcrypt = require('bcrypt')
const bcrypt_p = require('bcrypt-promise')
const jwt = require('jsonwebtoken')
const { TE, to } = require('../services/util.service')
const CONFIG = require('../config')

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Participant', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: 'uniqueKey',
        msg: 'Username already registered'
      },
      validate: {
        len: {
          args: [8, 30],
          msg: 'User name invalid, it must be between 8 to 30 characters.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: 'uniqueKey',
        msg: 'Email arlaready registered.'
      },
      validate: { isEmail: { msg: 'Invalid email.' } }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: 'uniqueKey',
        msg: 'Phone already registered.'
      },
      validate: {
        len: { args: [7, 20], msg: 'Phone number invalid, too short.' },
        isNumeric: { msg: 'not a valid phone number.' }
      }
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    },
    emailVerified: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    uid: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    phoneVerified: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    password: DataTypes.STRING
  })

  Model.beforeSave(async (participant, options) => {
    let err
    if (participant.changed('password')) {
      let salt, hash
      ;[err, salt] = await to(bcrypt.genSalt(10))
      if (err) TE(err.message, true)
      ;[err, hash] = await to(bcrypt.hash(participant.password, salt))
      if (err) TE(err.message, true)

      participant.password = hash

      const UIDGenerator = require('uid-generator')
      const uidgen = new UIDGenerator(UIDGenerator.BASE16)
      const uid = await uidgen.generate()
      participant.uid = uid
    }
  })

  Model.prototype.comparePassword = async function(pw) {
    let err, pass
    if (!this.password) TE('Password was not set')
    ;[err, pass] = await to(bcrypt_p.compare(pw, this.password))
    if (err) TE(err)

    if (!pass) TE('Invalid password')

    return this
  }

  Model.prototype.getJWT = function() {
    let expiration_time = parseInt(CONFIG.jwt_expiration)
    return (
      'Bearer ' +
      jwt.sign({ participant_id: this.id }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time
      })
    )
  }

  Model.prototype.toWeb = function(pw) {
    let json = this.toJSON()
    return json
  }

  return Model
}
