const pool = require('../config/database');

async function createTicket({ user_id, subject, description, priority }) {
    const validPriorities = ['low', 'medium', 'high'];
    const p = validPriorities.includes((priority || '').toLowerCase()) ? priority.toLowerCase() : 'medium';

    const [result] = await pool.execute(
        'INSERT INTO tickets (user_id, subject, description, priority) VALUES (?, ?, ?, ?)',
        [user_id, subject.trim(), description.trim(), p]
    );

    const [rows] = await pool.execute('SELECT * FROM tickets WHERE id = ?', [result.insertId]);
    return rows[0];
}

async function getTickets({ user, status, priority, search, sort, openWithCustomer }) {
    if (openWithCustomer === 'true') {
        const [openTickets] = await pool.execute(
            `SELECT tickets.id, tickets.subject, tickets.status, users.name AS customer_name, users.email 
             FROM tickets 
             JOIN users ON tickets.user_id = users.id 
             WHERE tickets.status = 'open'`
        );
        return openTickets;
    }

    let sql = 'SELECT * FROM tickets';
    const params = [];
    const conditions = [];

    if (user.role !== 'agent') {
        conditions.push('user_id = ?');
        params.push(user.id);
    }

    if (status && ['open', 'in_progress', 'closed'].includes(status.toLowerCase())) {
        conditions.push('status = ?');
        params.push(status.toLowerCase());
    }

    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
        conditions.push('priority = ?');
        params.push(priority.toLowerCase());
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'oldest') {
        sql += ' ORDER BY created_at ASC';
    } else if (sort === 'priority') {
        sql += " ORDER BY FIELD(priority, 'high', 'medium', 'low'), created_at DESC";
    } else {
        sql += ' ORDER BY created_at DESC';
    }

    const [tickets] = await pool.execute(sql, params);

    if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        return tickets.filter(t =>
            (t.subject && t.subject.toLowerCase().includes(s)) ||
            (t.description && t.description.toLowerCase().includes(s))
        );
    }

    return tickets;
}

async function getTicketById(ticketId, user) {
    const [rows] = await pool.execute('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    if (!rows || rows.length === 0) {
        const err = new Error('Ticket not found');
        err.statusCode = 404;
        throw err;
    }

    const ticket = rows[0];

    if (user.role !== 'agent' && ticket.user_id !== user.id) {
        const err = new Error('Forbidden: You do not have permission to view this ticket');
        err.statusCode = 403;
        throw err;
    }

    const [custRows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [ticket.user_id]);
    ticket.customer = custRows.length > 0 ? custRows[0] : null;

    if (ticket.assigned_to) {
        const [agentRows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [ticket.assigned_to]);
        ticket.assigned_agent = agentRows.length > 0 ? agentRows[0] : null;
    } else {
        ticket.assigned_agent = null;
    }

    return ticket;
}

async function updateTicket(ticketId, updates, user) {
    if (user.role !== 'agent') {
        const err = new Error('Forbidden: Only support agents can update ticket status or assignment');
        err.statusCode = 403;
        throw err;
    }

    const [rows] = await pool.execute('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    if (!rows || rows.length === 0) {
        const err = new Error('Ticket not found');
        err.statusCode = 404;
        throw err;
    }

    const current = rows[0];
    const { status, priority, assigned_to } = updates;

    const newStatus = status ? status.toLowerCase() : current.status;
    const newPriority = priority ? priority.toLowerCase() : current.priority;
    const newAssignedTo = assigned_to !== undefined ? (assigned_to ? parseInt(assigned_to, 10) : null) : current.assigned_to;

    await pool.execute(
        'UPDATE tickets SET status = ?, priority = ?, assigned_to = ? WHERE id = ?',
        [newStatus, newPriority, newAssignedTo, ticketId]
    );

    const [updated] = await pool.execute('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    return updated[0];
}

async function deleteTicket(ticketId, user) {
    const [rows] = await pool.execute('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    if (!rows || rows.length === 0) {
        const err = new Error('Ticket not found');
        err.statusCode = 404;
        throw err;
    }

    const ticket = rows[0];

    if (user.role !== 'agent' && ticket.user_id !== user.id) {
        const err = new Error('Forbidden: You do not have permission to delete this ticket');
        err.statusCode = 403;
        throw err;
    }

    await pool.execute('DELETE FROM tickets WHERE id = ?', [ticketId]);
    return true;
}

async function getTicketStats() {
    const [tickets] = await pool.execute('SELECT status, priority FROM tickets');
    return {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        high_priority: tickets.filter(t => t.priority === 'high').length
    };
}

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    getTicketStats
};
