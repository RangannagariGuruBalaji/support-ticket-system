const { authenticate } = require('./authMiddleware');
const { requireRole } = require('./roleMiddleware');

module.exports = {
    authenticate,
    requireRole
};
