const { Comments } = require('../models');

class CommentRepository {

  findAll = async (postId) => {
    return await Comments.findAll({
      order: [["createdAt", "DESC"]],
      where: { postId },
    });
  }

  findOne = async (commentId) => {
    return await Comments.findOne({
      where: { commentId }
    });
  }
  
  create = async (input) => {
    await Comments.create(input);
  }

  update = async (updateData, commentId) => {
    await Comments.update(
      updateData,
      { where: { commentId } }
    );
  }

  destroy = async (commentId) => {
    await Comments.destroy({ where: { commentId } });
  }
}

module.exports = CommentRepository;