const { Gym, Category } = require('../models')
const gymController = {
  getHomePage: async (req, res, next) => {
    try {
      const gyms = await Gym.findAll({
        include: [Category],
        raw: true,
        nest: true,
      })
      const data = gyms.map((g) => ({
        ...g,
        description: g.description.substring(0, 50),
      }))
      res.render('gym', {
        gyms: data,
      })
    } catch (err) {
      next(err)
    }
  },
  getGym: async (req, res, next) => {
    try {
      const gym = await Gym.findByPk(req.params.id, {
        include: [Category],
        nest: true,
      })
      if (!gym) throw new Error("Gym doesn't exist")
      res.render('show', { gym: gym.toJSON() })
      await gym.increment('viewCounts')
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const gym = await Gym.findByPk(req.params.id, {
        include: [Category],
        raw: true,
        nest: true,
      })
      if (!gym) throw new Error("Gym doesn't exist")
      res.render('dashboard', { gym })
    } catch (err) {}
  },
}
module.exports = gymController
