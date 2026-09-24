const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

describe('Comment Endpoints (/api/tickets/:id/comments & /api/comments)', () => {
    let customerToken;
    let agentToken;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        pool.resetInMemoryStore();

        const custRes = await request(app).post('/api/auth/login').send({ email: 'customer@example.com', password: 'password123' });
        customerToken = custRes.body.data.token;

        const agentRes = await request(app).post('/api/auth/login').send({ email: 'agent@example.com', password: 'password123' });
        agentToken = agentRes.body.data.token;
    });

    it('adds a comment to ticket 1', async () => {
        const res = await request(app)
            .post('/api/tickets/1/comments')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ comment: 'Please check this urgent issue.' });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.comment).toBe('Please check this urgent issue.');
    });

    it('retrieves comments for ticket 1', async () => {
        const res = await request(app)
            .get('/api/tickets/1/comments')
            .set('Authorization', `Bearer ${agentToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });
});
