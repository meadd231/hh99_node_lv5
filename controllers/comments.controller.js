const CommentService = require('../services/comments.service');
const logger = require('../logs/logger');

class CommentController {
  commentService = new CommentService();

  postComment = async (req, res, next) => {
    try {
      const { userId, nickname } = res.locals.user;
      const { postId } = req.params;
      const { comment } = req.body;
      const input = { userId, nickname, postId, comment };

      // 데이터가 정상적으로 전달되지 않는 경우
      if (Object.keys(req.body).length !== 1 || comment === undefined) {
        return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      }

      await this.commentService.postComment(input);
      res.status(201).json({ message: "댓글 작성에 성공했습니다." });
    } catch (error) {
      next(error, req, res, '댓글 작성에 실패했습니다.');
    }
  }

  getComments = async (req, res, next) => {
    try {
      const { postId } = req.params;

      const comments = await this.commentService.getComments(postId);

      if (!comments.length) {
        return res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
      }

      res.status(200).json({ comments });
    } catch (error) {
      next(error, req, res, '댓글 조회에 실패했습니다.');
    }
  }

  // 댓글 수정
  putComment = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId, commentId } = req.params;
      const { comment } = req.body;
      const input = { userId, postId, commentId, comment };

      // 데이터가 정상적으로 전달되지 않는 경우
      if (Object.keys(req.body).length !== 1 || comment === undefined) {
        return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      }

      await this.commentService.putComment(input);

      res.status(200).json({ message: '댓글을 수정했습니다.' });
    } catch (error) {
      next(error, req, res, '댓글 수정에 실패했습니다.');      
    }
  }

  deleteComment = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { commentId } = req.params;
      const input = { userId, postId, commentId };

      await this.commentService.deleteComment(input);

      res.status(200).json({ message: "댓글을 삭제했습니다." });
    } catch (error) {
      next(error, req, res, '댓글 삭제에 실패했습니다.');
    }
  }
}

module.exports = CommentController;