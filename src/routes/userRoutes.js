const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware')
const upload = require('../config/multer')
const { getSelf, getUsers, deleteUser, editProfile, getUserById, toggleFriend, setCoverImage, getFriends } = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:userId/friends', getFriends);
router.get('/me',verifyToken, getSelf );
router.delete('/me', verifyToken, deleteUser);
router.patch('/profile', upload.single('profilePicture'), editProfile);
router.patch('/follow/:friendId', verifyToken, toggleFriend);
router.get('/:userId', verifyToken, getUserById);
router.patch('/:userId/updateCover', verifyToken, setCoverImage)

module.exports = router