const bcrypt = require('bcryptjs') //載入 bcrypt
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Gym, Comment, Favorite, Followship } = db
const userController = {
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { password, name, email } = req.body
      if (password !== req.body.passwordCheck) throw new Error('密碼不相符')
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('email already exist!')

      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash,
      })
      req.flash('success_messages', '成功註冊帳號')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/gym')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout(() => {
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: Comment, include: Gym },
          { model: Gym, as: 'FavoritedGym' },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
        ],
        order: [[Comment, 'id', 'DESC']],
        nest: true,
      })
      if (!user) throw new Error("User doesn't exist!")
      if (req.user && user.id !== req.user.id) {
        req.flash('error_messages', "You don't have permission!")
        res.redirect(`/users/${req.user.id}`)
      }
      const isFollowed = req.user && req.user.Followings.some((f) => f.id === user.id)
      res.render('users/profile', {
        user: user.toJSON(),
        isFollowed,
      })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true,
      })
      if (!user) throw new Error("User didn't exist!")
      if (req.user && user.id !== req.user.id) {
        req.flash('error_messages', 'You do not have permission')
        return res.redirect(`/users/${req.user.id}`)
      }
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const { file } = req
      if (!name) throw new Error('Name is required')
      const [user, filePath] = await Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      if (!user) throw new Error("User didn't exist!")
      await user.update({
        name,
        image: filePath || user.image,
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    } catch (err) {
      next(err)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { gymId } = req.params
      const [gym, favorite] = await Promise.all([
        Gym.findByPk(gymId),
        Favorite.findOne({
          where: {
            userId: req.user.id,
            gymId,
          },
        }),
      ])
      if (!gym) throw new Error("Gym didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      await Favorite.create({
        userId: req.user.id,
        gymId,
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          gymId: req.params.gymId,
        },
      })
      if (!favorite) throw new Error("You haven't favorited this gym")
      await favorite.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
      })

      const result = users
        .filter((user) => user.id !== req.user.id) // Filter out the current user
        .map((user) => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some((f) => f.id === user.id),
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      res.render('top-users', { users: result })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: req.user.id,
            followingId: req.params.userId,
          },
        }),
      ])

      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already following this user!')

      await Followship.create({
        followerId: req.user.id,
        followingId: userId,
      })

      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId,
        },
      })

      if (!followship) throw new Error("You haven't followed this user!")

      await followship.destroy()

      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
}
module.exports = userController
