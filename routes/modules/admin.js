const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

//gym
router.get('/gym/create', adminController.createGym)
router.get('/gym/:id/edit', adminController.editGym)
router.get('/gym/:id', adminController.getGym)
router.put('/gym/:id', upload.single('image'), adminController.putGym)
router.delete('/gym/:id', adminController.deleteGym)
router.get('/gym', adminController.getAdminPage)
router.post('/gym', upload.single('image'), adminController.postGym)

//user
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

//分類
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteGym)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('/', (req, res) => res.redirect('/admin/gym'))
module.exports = router
