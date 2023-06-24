const bcrypt = require('bcryptjs') //載入 bcrypt
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = db
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
        raw: true,
        nest: true,
      })
      if (!user) throw new Error("User didn't exist!")
      if (req.user && user.id !== req.user.id) {
        req.flash('error_messages', 'You do not have permission')
        return res.redirect(`/users/${req.user.id}`)
      }

      res.render('users/profile', { user })
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
}
module.exports = userController
