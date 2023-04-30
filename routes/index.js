const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const likesRouter = require('./likes');
const commentsRouter = require('./comments');
const postsRouter = require('./posts');

router.use("/", authRouter);
router.use("/posts", [likesRouter, commentsRouter, postsRouter]);

module.exports = router;