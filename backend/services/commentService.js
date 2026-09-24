const pool = require('../config/database');

async function getCommentsByTicketId(ticketId, user) {
    const [ticketRows] = await pool.execute('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    if (!ticketRows || ticketRows.length === 0) {
        const err = new Error('Ticket not found');
        err.statusCode = 404;
        throw err;
    }

    const ticket = ticketRows[0];
    if (user.role !== 'agent' && ticket.user_id !== user.id) {
        const err = new Error('Forbidden: You do not have permission to view comments for this ticket');
        err.statusCode = 403;
        throw err;
    }

    const [comments] = await pool.execute(
        `SELECT c.id, c.ticket_id, c.user_id, c.comment, c.created_at, u.name AS user_name, u.role AS user_role 
         FROM ticket_comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.ticket_id = ? 
         ORDER BY c.created_at ASC`,
        [ticketId]
    );

    return comments;
}

async function addCommentToTicket(ticketId, commentText, user) {
    const [ticketRows] = await pool.execute('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    if (!ticketRows || ticketRows.length === 0) {
        const err = new Error('Ticket not found');
        err.statusCode = 404;
        throw err;
    }

    const ticket = ticketRows[0];
    if (user.role !== 'agent' && ticket.user_id !== user.id) {
        const err = new Error('Forbidden: You cannot comment on another customer\'s ticket');
        err.statusCode = 403;
        throw err;
    }

    const [result] = await pool.execute(
        'INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)',
        [ticketId, user.id, commentText.trim()]
    );

    const [inserted] = await pool.execute(
        `SELECT c.id, c.ticket_id, c.user_id, c.comment, c.created_at, u.name AS user_name, u.role AS user_role 
         FROM ticket_comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.id = ?`,
        [result.insertId]
    );

    return inserted[0];
}

module.exports = {
    getCommentsByTicketId,
    addCommentToTicket
};
