const { Gym } = require('../models')

const adminController = {
  getAdminPage: async (req, res, next) => {
    try {
      const gyms = await Gym.findAll({
        raw: true,
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
      await Gym.create({
        name,
        tel,
        address,
        openingHours,
        description,
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
      })
      if (!gym) throw new Error("Gym didn't exist!")
      res.render('admin/show', { gym })
    } catch (err) {}
  },
}
module.exports = adminController
