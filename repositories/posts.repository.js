const { Posts } = require('../models');
const AppError = require('../utils/appError');

class PostRepository {
  create = async (input) => {
    await Posts.create(input).catch((error) => {
      throw AppError(400, "게시글 작성에 실패했습니다.");
    });
  }

  findAll = async () => {
    const posts = await Posts.findAll().catch((error) => {
      throw AppError(400, "게시글 조회에 실패했습니다.");
    });
    const posts1 = await Posts.findAll({
      order: [["createdAt", "desc"]],
    });
    return posts;
  }

  findOne = async (postId) => {
    return await Posts.findOne({
      where: { postId }
    }).catch((error) => {
      throw AppError(400, "게시글 조회에 실패했습니다.");
    });
  }

  updatePost = async (input, postId) => {
    await Posts.update(input, { where: { postId } }).catch((error) => {
      throw AppError(400, "게시글 수정에 실패했습니다.");
    });
  }

  deletePost = async (postId) => {
    await Posts.destroy({
      where: { postId },
    }).catch((error) => {
      throw AppError(400, "게시글 삭제에 실패했습니다.");
    });
  }

  // 좋아요 숫자를 감소시키는 메소드
  decrementLike = async (input) => {
    // 해당 colum의 by만큼 감소시킴.
    await Posts.decrement('likes', {
      by: 1,
      // Op.and는 WHERE에서 AND를 사용하기 위해 쓰는 연산자임.
      where: input,
    }).catch((error) => {
      throw AppError(400, "게시글 좋아요 취소에 실패했습니다.");
    });
  }

  // 좋아요 숫자를 증가시키는 메소드
  incrementLike = async (input) => {
    await Posts.increment('likes', {
      by: 1,
      where: input,
    }).catch((error) => {
      throw AppError(400, "게시글 좋아요에 실패했습니다.");
    });
  }
}

module.exports = PostRepository;