/**
 * Role Authorization Middleware
 * @param {string|string[]} roles Allowed role(s)
 */
function requireRole(roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: User authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden: You do not have permission to access this resource'
            });
        }

        next();
    };
}

module.exports = {
    requireRole
};
