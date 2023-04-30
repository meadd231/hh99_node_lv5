const LikeRepository = require('../repositories/likes.repository');
const PostRepository = require('../repositories/posts.repository');
const AppError = require('../utils/appError');


class PostService {
  likeRepository = new LikeRepository();
  postRepository = new PostRepository();

  getLikePosts = async (userId) => {
    return await this.likeRepository.findAllLikePost(userId);
  }
  
  putLike = async (input) => {
    const post = await this.postRepository.findOne(input.postId);
    if (!post) {
      throw new AppError(404, '게시글이 존재하지 않습니다.');
    }

    const like = await this.likeRepository.findOne(input);
    if (like) {
      await this.likeRepository.destroy(input);
      await this.postRepository.decrementLike(input);
      return '게시글에 좋아요를 취소하였습니다.';
    } else {
      await this.likeRepository.create(input);
      await this.postRepository.incrementLike(input);
      return '게시글에 좋아요를 등록하였습니다.';
    }
  }
}

module.exports = PostService;