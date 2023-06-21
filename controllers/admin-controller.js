const adminController = {
  getAdminPage: (req, res, next) => {
    return res.render('admin/gym')
  },
}
module.exports = adminController
