const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.post('/', authMiddleware, postsController.postPost);
router.get('/', postsController.getPosts);
router.get('/:postId', postsController.getPost);
router.put('/:postId', authMiddleware, postsController.putPost);
router.delete('/:postId', authMiddleware, postsController.deletePost);

module.exports = router;
