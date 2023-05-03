class LikeRepository {
  constructor (postsModel, likesModel) {
    this.postsModel = postsModel;
    this.likesModel = likesModel;
  }

  findAllLikePost = async (userId) => {
    const likePosts = await this.postsModel.findAll({
      order: [
        ["likes", "desc"],
        ["createdAt", "desc"],
      ],
      include: [
        {
          model: this.likesModel,
          where: { userId },
          attributes: [],
          required: false,
        },
      ],
    });
    console.log(likePosts);
    return likePosts;
  }

  findOne = async (input) => {
    return await this.likesModel.findOne({
      where: input,
      attributes: ["likeId"],
    });
  }

  create = async (input) => {
    await this.likesModel.create(input);
  }

  destroy = async (input) => {
    await this.likesModel.destroy({
      where: input
    });
  }
}

module.exports = LikeRepository;