const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.registerUser({ name, email, password });
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: result
        });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ success: false, error: err.message });
        }
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser({ email, password });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ success: false, error: err.message });
        }
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    getMe
};
