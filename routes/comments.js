const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// Controller import
const CommentController = require('../controllers/comments.controller');
const commentController = new CommentController();

router.post('/:postId/comments', authMiddleware, commentController.postComment);

router.get('/:postId/comments', commentController.getComments);

// commentController의 putComment 메소드를 router.put() 메소드에 등록한다. 이벤트 등록을 한다는 의미 같음.
router.put('/:postId/comments/:commentId', authMiddleware, commentController.putComment);

router.delete('/:postId/comments/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
