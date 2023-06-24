const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categoriesPromise = await Category.findAll({
        raw: true,
      })
      const categoryPromise = (await req.params.id) ? Category.findByPk(req.params.id, { raw: true }) : null
      const [categories, category] = await Promise.all([categoriesPromise, categoryPromise])
      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required')
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error('Category does not exist')
      await category.update({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteGym: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist")
      await category.destroy()
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
}

module.exports = categoryController
