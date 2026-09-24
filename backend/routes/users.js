const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');

// Users listing route (Agent Only)
router.get('/', authenticate, requireRole('agent'), userController.getUsers);

module.exports = router;
