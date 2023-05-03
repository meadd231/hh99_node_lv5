class CommentRepository {
  constructor (commentsModel) {
    this.commentsModel = commentsModel;
  }

  findAll = async (postId) => {
    return await this.commentsModel.findAll({
      order: [["createdAt", "DESC"]],
      where: { postId },
    });
  }

  findOne = async (commentId) => {
    return await this.commentsModel.findOne({
      where: { commentId }
    });
  }
  
  create = async (input) => {
    await this.commentsModel.create(input);
  }

  update = async (updateData, commentId) => {
    await this.commentsModel.update(
      updateData,
      { where: { commentId } }
    );
  }

  destroy = async (commentId) => {
    await this.commentsModel.destroy({ where: { commentId } });
  }
}

module.exports = CommentRepository;