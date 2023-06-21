const express = require('express')
const router = express.Router()
const gymController = require('../controllers/gym-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/sigin', userController.signInPage)
router.get('/gym', gymController.getHomePage)

router.get('/', (req, res) => res.redirect('/gym'))
router.use('/', generalErrorHandler)

module.exports = router
