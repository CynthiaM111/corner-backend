const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-user-info', authMiddleware, getUserInfo);

module.exports = router;