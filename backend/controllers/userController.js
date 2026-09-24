const userService = require('../services/userService');

const getUsers = async (req, res, next) => {
    try {
        const { role } = req.query;
        const users = await userService.getAllUsers(role);
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUsers
};
