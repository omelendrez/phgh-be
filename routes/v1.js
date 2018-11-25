const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.controller')
const RoleController = require('../controllers/role.controller')
const HomeController = require('../controllers/home.controller')
const ConfigController = require('../controllers/config.controller')
const AuditController = require('../controllers/audit.controller')
const HolidayController = require('../controllers/holiday.controller')

const ParticipantController = require('../controllers/participant.controller')
const AccountController = require('../controllers/account.controller')
const BitcoinAccountController = require('../controllers/bitcoin_account.controller')

const adminPassport = require('passport')
const participantPassport = require('passport')

require('./../middleware/adminPassport')(adminPassport)
require('./../middleware/participantPassport')(participantPassport)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ success: true, message: 'Parcel Pending API', data: { 'version_number': 'v1.0.0' } })
})

router.post('/users/login', UserController.login)
router.post('/users', adminPassport.authenticate('jwt', { session: false }), UserController.create)
router.get('/users', adminPassport.authenticate('jwt', { session: false }), UserController.getAll)
router.put('/users/:id', adminPassport.authenticate('jwt', { session: false }), UserController.update)
router.delete('/users/:id', adminPassport.authenticate('jwt', { session: false }), UserController.remove)

router.post('/roles', adminPassport.authenticate('jwt', { session: false }), RoleController.create)
router.get('/roles', adminPassport.authenticate('jwt', { session: false }), RoleController.getAll)
router.put('/roles/:id', adminPassport.authenticate('jwt', { session: false }), RoleController.update)
router.delete('/roles/:id', adminPassport.authenticate('jwt', { session: false }), RoleController.remove)

router.post('/userroles', adminPassport.authenticate('jwt', { session: false }), RoleController.createUserRole)
router.get('/userroles/:id', adminPassport.authenticate('jwt', { session: false }), RoleController.getUserRoles)

router.get('/config', adminPassport.authenticate('jwt', { session: false }), ConfigController.get)
router.put('/config', adminPassport.authenticate('jwt', { session: false }), ConfigController.update)

router.get('/audit', adminPassport.authenticate('jwt', { session: false }), AuditController.getAll)

router.post('/holiday', adminPassport.authenticate('jwt', { session: false }), HolidayController.create)
router.put('/holiday/:id', adminPassport.authenticate('jwt', { session: false }), HolidayController.update)
router.get('/holiday', adminPassport.authenticate('jwt', { session: false }), HolidayController.getAll)
router.delete('/holiday/:id', adminPassport.authenticate('jwt', { session: false }), HolidayController.remove)

router.get('/dash', adminPassport.authenticate('jwt', { session: false }), HomeController.Dashboard)

router.post('/participants', ParticipantController.create)
router.post('/participants/login', ParticipantController.login)
router.post('/participants/forgot-password', ParticipantController.forgotPassword)
router.post('/participants/confirm', ParticipantController.confirm)
router.post('/participants/reset-password', ParticipantController.resetPassword)

router.post('/account', participantPassport.authenticate('jwt', { session: false }), AccountController.create)
router.get('/account/:id', participantPassport.authenticate('jwt', { session: false }), AccountController.getAll)
router.delete('/account/:id', participantPassport.authenticate('jwt', { session: false }), AccountController.remove)

router.post('/bitcoin-account', participantPassport.authenticate('jwt', { session: false }), BitcoinAccountController.create)
router.get('/bitcoin-account/:id', participantPassport.authenticate('jwt', { session: false }), BitcoinAccountController.getAll)
router.delete('/bitcoin-account/:id', participantPassport.authenticate('jwt', { session: false }), BitcoinAccountController.remove)

module.exports = router
