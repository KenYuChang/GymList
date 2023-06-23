const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/gym/create', adminController.createGym)
router.get('/gym/:id/edit', adminController.editGym)
router.get('/gym/:id', adminController.getGym)
router.put('/gym/:id', adminController.putGym)
router.delete('/gym/:id', adminController.deleteGym)
router.get('/gym', adminController.getAdminPage)
router.post('/gym', adminController.postGym)
router.get('/', (req, res) => res.redirect('/admin/gym'))
module.exports = router
