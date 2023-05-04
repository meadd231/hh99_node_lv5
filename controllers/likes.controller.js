const LikeService = require('../services/likes.service');
const PostService = require('../services/posts.service');

class LikesController {
  likeService = new LikeService();
  postService = new PostService();

  getLikePosts = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const posts = await this.likeService.getLikePosts(userId);
      return res.status(200).json({ posts });
    } catch (error) {
      next(error, req, res, '좋아요 게시글 조회에 실패하였습니다.');
    }
  }

  putLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const input = { postId, userId };

      const message = await this.likeService.putLike(input);
      return res.status(200).json({ message });
    } catch (error) {
      next(error, req, res, '게시글 좋아요에 실패하였습니다.');
    }
  }
}

module.exports = LikesController;