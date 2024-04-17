const express = require('express');
const router = express.Router();
const {getProjects, createProject, getProjectById} = require('../controllers/projectController')
const {verifyToken} = require('../middlewares/authMiddleware')
const upload = require('../config/multer')

router.get('/', verifyToken, getProjects );
router.post('/', verifyToken, upload.single('image'), createProject);
router.get('/:projectId',verifyToken, getProjectById);


module.exports = router;