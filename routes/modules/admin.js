const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/gym', authenticatedAdmin, adminController.getAdminPage)
router.use('/', (req, res) => res.redirect('/admin/gym'))
module.exports = router
