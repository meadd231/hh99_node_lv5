const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const LikesController = require('../controllers/likes.controller');
const likesController = new LikesController();

// posts/:postId <- 여기로 들어가는 문제가 있었음.
router.get('/like', authMiddleware, likesController.getLikePosts);

// 좋아요 등록, 취소
router.put('/:postId/like', authMiddleware, likesController.putLike);

module.exports = router;