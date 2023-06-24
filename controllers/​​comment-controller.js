const { Comment, User, Gym } = require('../models')
const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { gymId, text } = req.body
      const userId = req.user.id
      if (!text) throw new Error('Comment text is required!')

      const [user, gym] = await Promise.all([User.findByPk(userId), Gym.findByPk(gymId)])

      if (!user) throw new Error("User didn't exist!")
      if (!gym) throw new Error("Gym didn't exist!")

      await Comment.create({
        text,
        gymId,
        userId,
      })

      res.redirect(`/gym/${gymId}`)
    } catch (err) {
      next(err)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      if (!comment) throw new Error("Comment didn't exist!")
      const deleteComment = await comment.destroy()
      res.redirect(`/gym/${deleteComment.gymId}`)
    } catch (err) {
      next(err)
    }
  },
}

module.exports = commentController
