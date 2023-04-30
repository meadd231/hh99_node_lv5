const PostService = require('../services/posts.service');
const AppError = require('../utils/appError');

// Post의 컨트롤러(Controller)역할을 하는 클래스
class PostsController {
  postService = new PostService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  postPost = async (req, res) => {
    try {
      const { userId, nickname } = res.locals.user;
      const { title, content } = req.body;
      const input = { userId, nickname, title, content };

      if (Object.keys(req.body).length !== 2) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }

      if (!title || title === "") {
        throw new AppError(412, '게시글 제목의 형식이 일치하지 않습니다.');
      }
      if (!content || content === "") {
        throw new AppError(412, '게시글 내용의 형식이 일치하지 않습니다.');
      }


      await this.postService.createPost(input);
      return res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
    } catch (error) {
      errorHandling(error, req, res, '게시글 작성에 실패하였습니다.');
    }
  }

  getPosts = async (req, res) => {
    try {
      const posts = await this.postService.getPosts();
      return res.status(200).json({ posts: posts });
    } catch (error) {
      errorHandling(error, req, res, '게시글 조회에 실패하였습니다.');
    }
  }

  getPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.getPost(postId);
      return res.status(200).json({ post });
    } catch (error) {
      errorHandling(error, req, res, '게시글 조회에 실패하였습니다.');
    }
  }

  putPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
      const { userId } = res.locals.user;
      const input = { postId, title, content, userId };
      if (!title || !content) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }

      await this.postService.putPost(input);
      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
      errorHandling(error, req, res, '게시글 수정에 실패하였습니다.');
    }
  }

  deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const input = { postId, userId };

      await this.postService.deletePost(input);
      return res.json({ message: '게시글을 삭제하였습니다.' });
    } catch (error) {
      errorHandling(error, req, res, '게시글 삭제에 실패하였습니다.');
    }
  }

  // 에러 처리
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

module.exports = PostsController;