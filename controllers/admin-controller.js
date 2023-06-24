const { Gym, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getAdminPage: async (req, res, next) => {
    try {
      const gyms = await Gym.findAll({
        raw: true,
        nest: true,
        include: [Category],
      })
      res.render('admin/gym', { gyms })
    } catch (err) {
      next(err)
    }
  },
  createGym: (req, res, next) => {
    return res.render('admin/create-gym')
  },
  postGym: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Gym name is required')
      const { file } = req
      const filePath = await imgurFileHandler(file)
      await Gym.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
      })
      req.flash('success_messages', 'Gym was successfully created')
      res.redirect('/admin/gym')
    } catch (err) {
      next(err)
    }
  },
  getGym: async (req, res, next) => {
    try {
      const id = req.params.id
      const gym = await Gym.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category],
      })
      if (!gym) throw new Error("Gym didn't exist!")
      res.render('admin/show', { gym })
    } catch (err) {}
  },
  editGym: async (req, res, next) => {
    try {
      const id = req.params.id
      const gym = await Gym.findByPk(id, {
        raw: true,
      })
      if (!gym) throw new Error("Gym didn't exist!")
      res.render('admin/edit-gym', { gym })
    } catch (err) {
      next(err)
    }
  },
  putGym: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Gym name is required')
      const { file } = req
      const [gym, filePath] = await Promise.all([Gym.findByPk(req.params.id), imgurFileHandler(file)])
      if (!gym) throw new Error("Gym didn't exist")
      await gym.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || gym.image,
      })
      req.flash('success_messages', 'Gym was successfully created')
      res.redirect('/admin/gym')
    } catch (err) {
      next(err)
    }
  },
  deleteGym: async (req, res, next) => {
    try {
      const id = req.params.id
      const gym = await Gym.findByPk(id)
      if (!gym) throw new Error("Gym didn't exist")
      await gym.destroy()
      res.redirect('/admin/gym')
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true,
      })
      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        throw new Error("User doesn't exist")
      }
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      } else {
        await user.update({
          isAdmin: !user.isAdmin,
        })
      }
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  },
}
module.exports = adminController
