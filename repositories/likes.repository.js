const { Posts, Likes } = require('../models');

class LikeRepository {
  findAllLikePost = async (userId) => {
    const likePosts = await Posts.findAll({
      order: [
        ["likes", "desc"],
        ["createdAt", "desc"],
      ],
      include: [
        {
          model: Likes,
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
    return await Likes.findOne({
      where: input,
      attributes: ["likeId"],
    });
  }

  create = async (input) => {
    await Likes.create(input);
  }

  destroy = async (input) => {
    await Likes.destroy({
      where: input
    });
  }
}

module.exports = LikeRepository;