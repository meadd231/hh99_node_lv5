const CommentRepository = require('../repositories/comments.repository');
const PostRepository = require('../repositories/posts.repository');
const { Comments, Posts } = require('../models');
const AppError = require('../utils/appError');

class CommentService {
  commentRepository = new CommentRepository(Comments);
  postRepository = new PostRepository(Posts);


  // 댓글 작성
  postComment = async (input) => {
    await this.postExistCheck(input.postId);
    this.commentEmptyCheck(input.comment);

    await this.commentRepository.create(input);
  }


  // 댓글 조회
  getComments = async (postId) => {
    await this.postExistCheck(postId);

    return await this.commentRepository.findAll(postId);
  }


  // 댓글 수정
  putComment = async (input) => {
    await this.postExistCheck(input.postId);
    await this.commentCheck(input);

    this.commentEmptyCheck(input.comment);

    const updateData = { comment: input.comment, updatedAt: new Date() };
    await this.commentRepository.update(updateData, input.commentId);
  }


  // 댓글 삭제
  deleteComment = async (input) => {
    await this.postExistCheck(input.postId);
    await this.commentCheck(input);

    await this.commentRepository.destroy(input.commentId);
  }

  // 게시글이 존재하지 않는 경우
  postExistCheck = async (postId) => {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new AppError(404, '게시글이 존재하지 않습니다.');
    }
  }

  // 댓글에 에러가 존재하는 경우
  commentCheck = async (input) => {
    const comment = await this.commentRepository.findOne(input.commentId);
    this.commentExistCheck(comment);
    this.commentPermissionCheck(input.userId, comment.userId);
  }

  // 댓글이 존재하지 않는 경우
  commentExistCheck = (comment) => {
    if (!comment) {
      throw new AppError(404, '댓글이 존재하지 않습니다.');
    }
  }

  // 댓글에 권한이 존재하지 않는 경우
  commentPermissionCheck = (inputUserId, CommentUserId) => {
    if (inputUserId !== CommentUserId) {
      throw new AppError(403, '댓글의 삭제 권한이 존재하지 않습니다.');
    }
  }

  // 내용이 비어있는 경우
  commentEmptyCheck = (comment) => {
    if (comment === "") {
      throw new AppError(412, '댓글 내용을 입력해주세요.');
    }
  }
}

module.exports = CommentService;