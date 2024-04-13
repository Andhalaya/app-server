const express = require('express');
const router = express.Router();
const {getPosts, createPost, deletePost, likePost, addComment} = require('../controllers/PostController')
const {verifyToken} = require('../middlewares/authMiddleware')
const upload = require('../config/multer')

router.get('/', verifyToken, getPosts );
router.post('/', verifyToken, upload.single('image'), createPost);
router.delete('/:postId', verifyToken, deletePost);
router.patch('/:postId/like', verifyToken, likePost);
router.patch('/:postId/comment', verifyToken, addComment);

module.exports = router;