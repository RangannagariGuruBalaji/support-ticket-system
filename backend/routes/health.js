const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint for deployment monitoring
 */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Support Ticket API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
