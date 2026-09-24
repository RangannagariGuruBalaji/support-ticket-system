/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
    console.error('API Error:', err.stack || err.message || err);

    const statusCode = err.statusCode || res.statusCode || 500;
    const responseStatusCode = statusCode >= 400 ? statusCode : 500;

    res.status(responseStatusCode).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
}

function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: `Route '${req.originalUrl}' not found`
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
