const express = require('express')
const router = express.Router()
const gymController = require('../controllers/gym-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/​​comment-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

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

//gym
router.get('/gym/feeds', authenticated, gymController.getFeeds)
router.get('/gym/:id/dashboard', authenticated, gymController.getDashboard)
router.get('/gym/:id', authenticated, gymController.getGym)

router.get('/gym', authenticated, gymController.getHomePage)

//comments
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)
//users
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

//favorites
router.post('/favorite/:gymId', authenticated, userController.addFavorite)
router.delete('/favorite/:gymId', authenticated, userController.removeFavorite)

router.get('/', (req, res) => res.redirect('/gym'))
router.use('/', generalErrorHandler)

module.exports = router
