const express = require('express')
const router = express.Router()
const gymController = require('../controllers/gym-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
  userController.signIn
)
router.get('/logout', userController.logout)
router.get('/gym', gymController.getHomePage)

router.get('/', (req, res) => res.redirect('/gym'))
router.use('/', generalErrorHandler)

module.exports = router
