const { ExtractJwt, Strategy } = require('passport-jwt')
const { Participant } = require('../models')
const CONFIG = require('../config')
const { to } = require('../services/util.service')

module.exports = function (passport) {
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = CONFIG.jwt_encryption

    passport.use(new Strategy(opts, async function (jwt_payload, done) {
        let err, participant;
        [err, participant] = await to(Participant.findById(jwt_payload.participant_id))

        if (err) return done(err, false)
        if (participant) {
            return done(null, participant)
        } else {
            return done(null, false)
        }
    }))
}
