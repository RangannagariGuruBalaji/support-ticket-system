const pool = require('../config/database');

async function getAllUsers(roleFilter) {
    let sql = 'SELECT id, name, email, role, created_at FROM users';
    const params = [];

    if (roleFilter && ['customer', 'agent'].includes(roleFilter.toLowerCase())) {
        sql += ' WHERE role = ?';
        params.push(roleFilter.toLowerCase());
    }

    sql += ' ORDER BY name ASC';

    const [users] = await pool.execute(sql, params);
    return users;
}

module.exports = {
    getAllUsers
};
