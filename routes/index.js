const express = require('express')
const router = express.Router()
const gymController = require('../controllers/gym-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
//註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
//登入
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
  userController.signIn
)
//登出
router.get('/logout', userController.logout)

router.get('/gym', authenticated, gymController.getHomePage)

router.get('/', (req, res) => res.redirect('/gym'))
router.use('/', generalErrorHandler)

module.exports = router
