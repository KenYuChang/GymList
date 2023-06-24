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
}
module.exports = gymController
