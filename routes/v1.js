const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.controller')
const RoleController = require('../controllers/role.controller')
const HomeController = require('../controllers/home.controller')
const ConfigController = require('../controllers/config.controller')
const AuditController = require('../controllers/audit.controller')
const HolidayController = require('../controllers/holiday.controller')

const ParticipantController = require('../controllers/participant.controller')

const passport = require('passport')

require('./../middleware/passport')(passport)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ success: true, message: 'Parcel Pending API', data: { 'version_number': 'v1.0.0' } })
})

router.post('/users/login', UserController.login)
router.post('/users', passport.authenticate('jwt', { session: false }), UserController.create)
router.get('/users', passport.authenticate('jwt', { session: false }), UserController.getAll)
router.put('/users/:id', passport.authenticate('jwt', { session: false }), UserController.update)
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), UserController.remove)

router.post('/roles', passport.authenticate('jwt', { session: false }), RoleController.create)
router.get('/roles', passport.authenticate('jwt', { session: false }), RoleController.getAll)
router.put('/roles/:id', passport.authenticate('jwt', { session: false }), RoleController.update)
router.delete('/roles/:id', passport.authenticate('jwt', { session: false }), RoleController.remove)

router.post('/userroles', passport.authenticate('jwt', { session: false }), RoleController.createUserRole)
router.get('/userroles/:id', passport.authenticate('jwt', { session: false }), RoleController.getUserRoles)

router.get('/config', passport.authenticate('jwt', { session: false }), ConfigController.get)
router.put('/config', passport.authenticate('jwt', { session: false }), ConfigController.update)

router.get('/audit', passport.authenticate('jwt', { session: false }), AuditController.getAll)

router.post('/holiday', passport.authenticate('jwt', { session: false }), HolidayController.create)
router.put('/holiday/:id', passport.authenticate('jwt', { session: false }), HolidayController.update)
router.get('/holiday', passport.authenticate('jwt', { session: false }), HolidayController.getAll)
router.delete('/holiday/:id', passport.authenticate('jwt', { session: false }), HolidayController.remove)

router.get('/dash', passport.authenticate('jwt', { session: false }), HomeController.Dashboard)

router.post('/participants', ParticipantController.create)
router.post('/participants/login', ParticipantController.login)
router.post('/participants/confirm', ParticipantController.confirm)

module.exports = router
