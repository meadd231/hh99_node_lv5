const PostRepository = require('../repositories/posts.repository');
const { Posts } = require('../models');
const AppError = require('../utils/appError');

class PostService {
  postRepository = new PostRepository(Posts);

  postPost = async (input) => {
    await this.postRepository.create(input);
  }

  getPosts = async () => {
    const allPost = await this.postRepository.findAll();

    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    allPost.sort((a, b) => {
      return b.createdAt - a.createdAt;
    })

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return allPost;
  }

  getPost = async (postId) => {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new AppError(404, '게시글이 존재하지 않습니다.');
    }
    return post;
  }

  putPost = async (input) => {

    const post = await this.postRepository.findOne(input.postId);
    if (!post) {
      throw new AppError(404, '게시글이 존재하지 않습니다.');
    }

    if (post.userId != input.userId) {
      throw new AppError(403, '게시글의 수정 권한이 존재하지 않습니다.');
    }

    const { title, content } = input;
    const postData = { title, content };
    postData.updatedAt = Date.now();
    await this.postRepository.update(postData, input.postId);
  }

  deletePost = async (input) => {

    const post = await this.postRepository.findOne(input.postId);
    if (!post) {
      throw new AppError(404, '게시글이 존재하지 않습니다.');
    }

    if (post.userId != input.userId) {
      throw new AppError(403, '게시글의 삭제 권한이 존재하지 않습니다.');
    }

    await this.postRepository.delete(input.postId);
  }
}

module.exports = PostService;