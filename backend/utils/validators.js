/**
 * Input validator utilities
 */

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function isValidPriority(priority) {
    return ['low', 'medium', 'high'].includes((priority || '').toLowerCase());
}

function isValidStatus(status) {
    return ['open', 'in_progress', 'closed'].includes((status || '').toLowerCase());
}

module.exports = {
    isValidEmail,
    isValidPriority,
    isValidStatus
};
