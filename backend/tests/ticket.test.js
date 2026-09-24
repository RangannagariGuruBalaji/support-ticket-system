const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

describe('Ticket Endpoints (/api/tickets)', () => {
    let customerToken;
    let customer2Token;
    let agentToken;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        pool.resetInMemoryStore();

        const custRes = await request(app).post('/api/auth/login').send({ email: 'customer@example.com', password: 'password123' });
        customerToken = custRes.body.data.token;

        const cust2Res = await request(app).post('/api/auth/login').send({ email: 'alice@example.com', password: 'password123' });
        customer2Token = cust2Res.body.data.token;

        const agentRes = await request(app).post('/api/auth/login').send({ email: 'agent@example.com', password: 'password123' });
        agentToken = agentRes.body.data.token;
    });

    it('rejects unauthenticated request to /api/tickets (401)', async () => {
        const res = await request(app).get('/api/tickets');
        expect(res.statusCode).toBe(401);
    });

    it('creates a new support ticket for customer', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                subject: 'New Issue Test',
                description: 'Need assistance with account settings',
                priority: 'high'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.subject).toBe('New Issue Test');
    });

    it('prevents Customer 2 from accessing Customer 1 ticket (403 Forbidden)', async () => {
        const res = await request(app)
            .get('/api/tickets/1') // Ticket 1 belongs to customer 1
            .set('Authorization', `Bearer ${customer2Token}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toContain('Forbidden');
    });

    it('allows Agent to access any ticket', async () => {
        const res = await request(app)
            .get('/api/tickets/1')
            .set('Authorization', `Bearer ${agentToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.id).toBe(1);
    });

    it('allows Agent to update ticket status and priority', async () => {
        const res = await request(app)
            .put('/api/tickets/1')
            .set('Authorization', `Bearer ${agentToken}`)
            .send({
                status: 'in_progress',
                priority: 'high',
                assigned_to: 3
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe('in_progress');
    });

    it('returns open tickets with customer details via JOIN query', async () => {
        const res = await request(app)
            .get('/api/tickets?openWithCustomer=true')
            .set('Authorization', `Bearer ${agentToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
