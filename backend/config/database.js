require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

/**
 * In-Memory DB Engine for standalone testing and resilient offline execution
 */
class InMemoryDB {
    constructor() {
        this.resetData();
    }

    resetData() {
        // Valid bcrypt hash for 'password123'
        const defaultHash = bcrypt.hashSync('password123', 10);
        this.users = [
            { id: 1, name: 'John Customer', email: 'customer@example.com', password_hash: defaultHash, role: 'customer', created_at: new Date().toISOString() },
            { id: 2, name: 'Alice Smith', email: 'alice@example.com', password_hash: defaultHash, role: 'customer', created_at: new Date().toISOString() },
            { id: 3, name: 'Support Sarah', email: 'agent@example.com', password_hash: defaultHash, role: 'agent', created_at: new Date().toISOString() },
            { id: 4, name: 'Support Bob', email: 'bob.agent@example.com', password_hash: defaultHash, role: 'agent', created_at: new Date().toISOString() }
        ];

        this.tickets = [
            { id: 1, user_id: 1, subject: 'Cannot access billing invoice', description: 'I am unable to download my PDF invoice for August 2026. Page returns 500 error.', priority: 'high', status: 'open', assigned_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 2, user_id: 1, subject: 'Feature Request: Dark Mode', description: 'Would love to have an option to switch to dark theme in customer dashboard.', priority: 'low', status: 'in_progress', assigned_to: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 3, user_id: 2, subject: 'Password reset email not received', description: 'I requested a password reset email 2 hours ago and have not received it yet.', priority: 'medium', status: 'open', assigned_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 4, user_id: 2, subject: 'Account deletion inquiry', description: 'Please let me know the procedure to delete my account and data per GDPR.', priority: 'medium', status: 'closed', assigned_to: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ];

        this.comments = [
            { id: 1, ticket_id: 1, user_id: 1, comment: 'Here is additional context: I tried on Chrome and Firefox, same error.', created_at: new Date().toISOString() },
            { id: 2, ticket_id: 2, user_id: 3, comment: 'Hello John! We are currently working on this feature, stay tuned for updates.', created_at: new Date().toISOString() },
            { id: 3, ticket_id: 2, user_id: 1, comment: 'Awesome, thanks Sarah!', created_at: new Date().toISOString() },
            { id: 4, ticket_id: 4, user_id: 4, comment: 'Hello Alice, your account deletion request has been processed and confirmed.', created_at: new Date().toISOString() },
            { id: 5, ticket_id: 4, user_id: 2, comment: 'Thank you Bob for the quick assistance!', created_at: new Date().toISOString() }
        ];

        this.userIdCounter = 5;
        this.ticketIdCounter = 5;
        this.commentIdCounter = 6;
    }

    async execute(sql, params = []) {
        const normalizedSql = sql.trim().replace(/\s+/g, ' ');

        // USER Operations
        if (/INSERT INTO users/i.test(normalizedSql)) {
            const [name, email, password_hash, role] = params;
            if (this.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                const err = new Error("Duplicate entry for email");
                err.code = "ER_DUP_ENTRY";
                throw err;
            }
            const newUser = {
                id: this.userIdCounter++,
                name,
                email,
                password_hash,
                role: role || 'customer',
                created_at: new Date().toISOString()
            };
            this.users.push(newUser);
            return [{ insertId: newUser.id, affectedRows: 1 }];
        }

        if (/SELECT \* FROM users WHERE email = \?/i.test(normalizedSql)) {
            const [email] = params;
            const matches = this.users.filter(u => u.email.toLowerCase() === email.toLowerCase());
            return [matches];
        }

        if (/SELECT id, name, email, role, created_at FROM users WHERE role = \?/i.test(normalizedSql)) {
            const [role] = params;
            const matches = this.users.filter(u => u.role === role);
            return [matches];
        }

        if (/SELECT id, name, email, role, created_at FROM users/i.test(normalizedSql)) {
            return [this.users.map(({ password_hash, ...u }) => u)];
        }

        if (/SELECT \* FROM users WHERE id = \?/i.test(normalizedSql)) {
            const [id] = params;
            const matches = this.users.filter(u => u.id === Number(id));
            return [matches];
        }

        // TICKET Operations
        if (/INSERT INTO tickets/i.test(normalizedSql)) {
            const [user_id, subject, description, priority] = params;
            const newTicket = {
                id: this.ticketIdCounter++,
                user_id: Number(user_id),
                subject,
                description,
                priority: priority || 'medium',
                status: 'open',
                assigned_to: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            this.tickets.push(newTicket);
            return [{ insertId: newTicket.id, affectedRows: 1 }];
        }

        if (/SELECT tickets\.id, tickets\.subject, tickets\.status, users\.name AS customer_name, users\.email FROM tickets JOIN users/i.test(normalizedSql)) {
            const openTickets = this.tickets
                .filter(t => t.status === 'open')
                .map(t => {
                    const u = this.users.find(usr => usr.id === t.user_id) || {};
                    return {
                        id: t.id,
                        subject: t.subject,
                        status: t.status,
                        customer_name: u.name || 'Unknown',
                        email: u.email || 'N/A'
                    };
                });
            return [openTickets];
        }

        if (/SELECT \* FROM tickets WHERE user_id = \?/i.test(normalizedSql)) {
            const [userId] = params;
            return [this.tickets.filter(t => t.user_id === Number(userId))];
        }

        if (/SELECT \* FROM tickets WHERE id = \?/i.test(normalizedSql)) {
            const [id] = params;
            return [this.tickets.filter(t => t.id === Number(id))];
        }

        if (/SELECT \* FROM tickets/i.test(normalizedSql)) {
            return [this.tickets];
        }

        if (/UPDATE tickets SET/i.test(normalizedSql)) {
            const [status, priority, assigned_to, id] = params;
            const ticket = this.tickets.find(t => t.id === Number(id));
            if (ticket) {
                if (status !== undefined) ticket.status = status;
                if (priority !== undefined) ticket.priority = priority;
                if (assigned_to !== undefined) ticket.assigned_to = assigned_to ? Number(assigned_to) : null;
                ticket.updated_at = new Date().toISOString();
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }

        if (/DELETE FROM tickets WHERE id = \?/i.test(normalizedSql)) {
            const [id] = params;
            const index = this.tickets.findIndex(t => t.id === Number(id));
            if (index !== -1) {
                this.tickets.splice(index, 1);
                this.comments = this.comments.filter(c => c.ticket_id !== Number(id));
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }

        // COMMENT Operations
        if (/INSERT INTO ticket_comments/i.test(normalizedSql)) {
            const [ticket_id, user_id, comment] = params;
            const newComment = {
                id: this.commentIdCounter++,
                ticket_id: Number(ticket_id),
                user_id: Number(user_id),
                comment,
                created_at: new Date().toISOString()
            };
            this.comments.push(newComment);
            return [{ insertId: newComment.id, affectedRows: 1 }];
        }

        if (/WHERE c\.id = \?/i.test(normalizedSql)) {
            const [commentId] = params;
            const list = this.comments
                .filter(c => c.id === Number(commentId))
                .map(c => {
                    const u = this.users.find(usr => usr.id === c.user_id) || {};
                    return {
                        ...c,
                        user_name: u.name || 'Unknown User',
                        user_role: u.role || 'customer'
                    };
                });
            return [list];
        }

        if (/SELECT c\.\*, u\.name AS user_name, u\.role AS user_role FROM ticket_comments c JOIN users u/i.test(normalizedSql) ||
            /SELECT.*FROM ticket_comments/i.test(normalizedSql)) {
            const [ticketId] = params;
            const list = this.comments
                .filter(c => c.ticket_id === Number(ticketId))
                .map(c => {
                    const u = this.users.find(usr => usr.id === c.user_id) || {};
                    return {
                        ...c,
                        user_name: u.name || 'Unknown User',
                        user_role: u.role || 'customer'
                    };
                });
            return [list];
        }

        return [[]];
    }

    async query(sql, params = []) {
        return this.execute(sql, params);
    }
}

const inMemoryDbInstance = new InMemoryDB();

let realPool = null;
if (process.env.NODE_ENV !== 'test') {
    try {
        realPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'support_tickets',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    } catch (err) {
        console.warn('MySQL pool initialization warning, falling back to in-memory store:', err.message);
    }
}

const pool = {
    resetInMemoryStore() {
        inMemoryDbInstance.resetData();
    },
    async execute(sql, params = []) {
        if (process.env.NODE_ENV === 'test' || !realPool || process.env.USE_MOCK_DB === 'true') {
            return inMemoryDbInstance.execute(sql, params);
        }
        try {
            return await realPool.execute(sql, params);
        } catch (err) {
            if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ENOTFOUND') {
                return inMemoryDbInstance.execute(sql, params);
            }
            throw err;
        }
    },
    async query(sql, params = []) {
        return this.execute(sql, params);
    }
};

module.exports = pool;
