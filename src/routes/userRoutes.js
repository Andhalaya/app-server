const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware')
const { getSelf, getUsers, deleteUser, editProfile, getUserById, toggleFriend } = require('../controllers/userController');

router.get('/', verifyToken, getUsers);
router.get('/me',verifyToken, getSelf );
router.delete('/me', verifyToken, deleteUser);
router.patch('/profile', verifyToken, editProfile);
router.patch('/follow/:friendId', verifyToken, toggleFriend);
router.get('/:userId', verifyToken, getUserById)

module.exports = router