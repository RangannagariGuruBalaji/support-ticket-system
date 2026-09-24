const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

describe('Auth Endpoints (/api/auth)', () => {
    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        pool.resetInMemoryStore();
    });

    it('registers a new customer successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'New Registered User',
                email: 'newuser@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.role).toBe('customer');
    });

    it('rejects duplicate email registration (409)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Duplicate Email User',
                email: 'customer@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('logs in customer with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'customer@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });

    it('rejects login with invalid password (401)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'customer@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
