const LikeService = require('../services/likes.service');
const PostService = require('../services/posts.service');

class LikesController {
  likeService = new LikeService();
  postService = new PostService();

  getLikePosts = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const posts = await this.likeService.getLikePosts(userId);
      return res.status(200).json({ posts });
    } catch (error) {
      errorHandling(error, req, res, '좋아요 게시글 조회에 실패하였습니다.');
    }
  }

  putLike = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const input = { postId, userId };

      const message = await this.likeService.putLike(input);
      return res.status(200).json({ message });
    } catch (error) {
      errorHandling(error, req, res, '게시글 좋아요에 실패하였습니다.');
    }
  }

  errorHandling = (error, req, res, defaultMessage) => {
    console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
    console.error(error);

    if (!error.errorCode) {
      return res.status(400).json({ errorMessage: defaultMessage });
    } else {
      return res.status(error.errorCode).json({ errorMessage: error.errorMessage });
    }
  }
}

module.exports = LikesController;