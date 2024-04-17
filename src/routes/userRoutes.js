const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware')
const upload = require('../config/multer')
const { getSelf, getUsers, deleteUser, editProfile, getUserById, toggleFriend } = require('../controllers/userController');

router.get('/', verifyToken, getUsers);
router.get('/me',verifyToken, getSelf );
router.delete('/me', verifyToken, deleteUser);
router.patch('/profile', upload.single('profilePicture'), editProfile);
router.patch('/follow/:friendId', verifyToken, toggleFriend);
router.get('/:userId', verifyToken, getUserById)

module.exports = router