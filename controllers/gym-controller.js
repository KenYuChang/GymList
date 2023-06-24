const { Gym, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const gymController = {
  getHomePage: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const [gyms, categories] = await Promise.all([
        Gym.findAndCountAll({
          include: Category,
          where: categoryId ? { categoryId } : {},
          limit,
          offset,
          nest: true,
          raw: true,
        }),
        Category.findAll({ raw: true }),
      ])
      const data = gyms.rows.map((g) => ({
        ...g,
        description: g.description.substring(0, 50),
      }))
      return res.render('gym', {
        gyms: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, gyms.count),
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
