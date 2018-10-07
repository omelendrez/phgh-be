const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user.controller')
const RoleController = require('../controllers/role.controller')
const HomeController = require('../controllers/home.controller')

const custom = require('./../middleware/custom')

const passport = require('passport')
const path = require('path')

require('./../middleware/passport')(passport)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: 'success', message: 'Parcel Pending API', data: { 'version_number': 'v1.0.0' } })
})

router.post('/users', UserController.create)
router.get('/users', passport.authenticate('jwt', { session: false }), UserController.getAll)
router.put('/users', passport.authenticate('jwt', { session: false }), UserController.update)
router.delete('/users', passport.authenticate('jwt', { session: false }), UserController.remove)
router.post('/users/login', UserController.login)

router.post('/roles', passport.authenticate('jwt', { session: false }), RoleController.create)
router.get('/roles', passport.authenticate('jwt', { session: false }), RoleController.getAll)

router.get('/roles/:role_id', passport.authenticate('jwt', { session: false }), custom.role, RoleController.get)
router.put('/roles/:role_id', passport.authenticate('jwt', { session: false }), custom.role, RoleController.update)
router.delete('/roles/:role_id', passport.authenticate('jwt', { session: false }), custom.role, RoleController.remove)

router.get('/dash', passport.authenticate('jwt', { session: false }), HomeController.Dashboard)

router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')))
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')))
module.exports = router
