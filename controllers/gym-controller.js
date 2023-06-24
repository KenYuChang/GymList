const { Gym, Category, Comment, User } = require('../models')
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
      const favoritedGymIds = req.user ? req.user.FavoritedGym.map((fg) => fg.id) : []
      const data = gyms.rows.map((g) => ({
        ...g,
        description: g.description.substring(0, 50),
        isFavorited: favoritedGymIds.includes(g.id),
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
        include: [Category, { model: Comment, include: User }, { model: User, as: 'FavoritedUsers' }],
        nest: true,
      })
      if (!gym) throw new Error("Gym doesn't exist")
      const isFavorited = gym.FavoritedUsers.some((f) => f.id === req.user.id)
      res.render('show', {
        gym: gym.toJSON(),
        isFavorited,
      })
      await gym.increment('viewCounts')
    } catch (err) {
      console.error(err)
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
  getFeeds: async (req, res, next) => {
    try {
      const [gyms, comments] = await Promise.all([
        Gym.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [Category],
          raw: true,
          nest: true,
        }),
        Comment.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Gym],
          raw: true,
          nest: true,
        }),
      ])
      res.render('feeds', { gyms, comments })
    } catch (err) {
      next(err)
    }
  },
  getTopGyms: async (req, res, next) => {
    try {
      const gyms = await Gym.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }],
      })
      const topGyms = gyms
        .map((g) => ({
          ...g.toJSON(),
          description: g.description.substring(0, 50),
          favoritedCount: g.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedGym.some((f) => f.id === g.id),
        }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)

      res.render('top-gym', { gyms: topGyms })
    } catch (err) {
      next(err)
    }
  },
}
module.exports = gymController
