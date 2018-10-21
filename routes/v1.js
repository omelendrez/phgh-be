const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.controller')
const RoleController = require('../controllers/role.controller')
const HomeController = require('../controllers/home.controller')
const ConfigController = require('../controllers/config.controller')

const passport = require('passport')
const path = require('path')

require('./../middleware/passport')(passport)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: 'success', message: 'Parcel Pending API', data: { 'version_number': 'v1.0.0' } })
})

router.post('/users/login', UserController.login)

router.post('/users', UserController.create)
router.get('/users', passport.authenticate('jwt', { session: false }), UserController.getAll)
router.put('/users/:id', passport.authenticate('jwt', { session: false }), UserController.update)
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), UserController.remove)

router.post('/roles', passport.authenticate('jwt', { session: false }), RoleController.create)
router.get('/roles', passport.authenticate('jwt', { session: false }), RoleController.getAll)
router.put('/roles/:id', passport.authenticate('jwt', { session: false }), RoleController.update)
router.delete('/roles/:id', passport.authenticate('jwt', { session: false }), RoleController.remove)

router.post('/userroles', passport.authenticate('jwt', { session: false }), RoleController.createUserRole)
router.get('/userroles/:id', passport.authenticate('jwt', { session: false }), RoleController.getUserRoles)

router.get('/config', passport.authenticate('jwt', { session: false}), ConfigController.get)
router.put('/config', passport.authenticate('jwt', { session: false }), ConfigController.update)

router.get('/dash', passport.authenticate('jwt', { session: false }), HomeController.Dashboard)

router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')))
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')))


module.exports = router
