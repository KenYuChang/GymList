const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/gym', adminController.getAdminPage)
router.use('/', (req, res) => res.redirect('/admin/gym'))
module.exports = router
