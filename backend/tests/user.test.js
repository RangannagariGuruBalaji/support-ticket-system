const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

describe('User Endpoints (/api/users)', () => {
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

    it('rejects customer from viewing user list (403)', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.statusCode).toBe(403);
    });

    it('allows agent to view user list', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${agentToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
