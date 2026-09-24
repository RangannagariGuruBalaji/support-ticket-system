const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/ticket/:id', commentController.getComments);
router.post('/ticket/:id', commentController.addComment);

module.exports = router;
