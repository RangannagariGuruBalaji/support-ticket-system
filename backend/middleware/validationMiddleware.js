const { isValidEmail, isValidPriority, isValidStatus } = require('../utils/validators');

function validateRegistration(req, res, next) {
    const { name, email, password } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }
    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    next();
}

function validateTicketCreation(req, res, next) {
    const { subject, description } = req.body;
    if (!subject || !subject.trim()) {
        return res.status(400).json({ success: false, error: 'Subject is required' });
    }
    if (!description || !description.trim()) {
        return res.status(400).json({ success: false, error: 'Description is required' });
    }
    next();
}

module.exports = {
    validateRegistration,
    validateLogin,
    validateTicketCreation
};
