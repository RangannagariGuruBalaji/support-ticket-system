const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt');

async function registerUser({ name, email, password }) {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [trimmedEmail]);
    if (existing.length > 0) {
        const err = new Error('An account with this email already exists');
        err.statusCode = 409;
        throw err;
    }

    const password_hash = await bcrypt.hash(password, 10);

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [trimmedName, trimmedEmail, password_hash, 'customer']
        );

        const userId = result.insertId;
        const userPayload = { id: userId, name: trimmedName, email: trimmedEmail, role: 'customer' };
        const token = generateToken(userPayload);

        return { token, user: userPayload };
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const dupErr = new Error('An account with this email already exists');
            dupErr.statusCode = 409;
            throw dupErr;
        }
        throw err;
    }
}

async function loginUser({ email, password }) {
    const trimmedEmail = email.trim().toLowerCase();

    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [trimmedEmail]);
    if (!rows || rows.length === 0) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const userPayload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = generateToken(userPayload);

    return { token, user: userPayload };
}

async function getUserById(id) {
    const [rows] = await pool.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
}

module.exports = {
    registerUser,
    loginUser,
    getUserById
};
