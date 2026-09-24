const { verifyToken } = require('../utils/jwt');

/**
 * Authentication Middleware - Verifies JWT Token
 */
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Access denied: No authentication token provided'
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied: Token is missing'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // { id, role, name, email }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Access denied: Invalid or expired token'
        });
    }
}

module.exports = {
    authenticate
};
