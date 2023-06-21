const express = require('express')
const router = express.Router()
const gymController = require('../controllers/gym-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/gym', gymController.getHomePage)

router.use('/', (req, res) => res.redirect('/gym'))

module.exports = router
