// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const { addQuestion, addComment } = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

const createQuestionRoutes = (io) => {
    const router = express.Router();

    // Routes with io passed to handlers
    router.post('/add', authMiddleware, (req, res) => addQuestion(req, res, io)); // POST /questions/add
    router.post('/:id/comments', authMiddleware, (req, res) => addComment(req, res, io)); // POST /questions/:id/comments

    return router;
};

module.exports = createQuestionRoutes;