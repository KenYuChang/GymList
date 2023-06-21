const bcrypt = require('bcryptjs') //載入 bcrypt
const db = require('../models')
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
  signInPage: (req, res, next) => {
    res.render('signin')
  },
}
module.exports = userController
