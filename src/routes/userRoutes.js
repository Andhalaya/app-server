const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware')
const { getSelf, getUsers, deleteUser } = require('../controllers/userController');

router.get('/', verifyToken, getUsers)
router.get('/me',verifyToken, getSelf )
router.delete('/me', verifyToken, deleteUser)

module.exports = router