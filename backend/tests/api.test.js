const request = require('supertest');
const app = require('../server');
const pool = require('../db');

describe('Support Ticket System REST API Test Suite', () => {
    let customerToken;
    let customer2Token;
    let agentToken;
    let createdTicketId;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        pool.resetInMemoryStore();
    });

    // ----------------------------------------------------
    // 1. HEALTH CHECK API
    // ----------------------------------------------------
    describe('GET /api/health', () => {
        it('should return 200 OK with health status', async () => {
            const res = await request(app).get('/api/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('ok');
            expect(res.body.message).toContain('Support Ticket API');
        });
    });

    // ----------------------------------------------------
    // 2. AUTHENTICATION APIs
    // ----------------------------------------------------
    describe('Auth Endpoints', () => {
        it('should successfully register a new customer', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test Customer',
                    email: 'newcustomer@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.user.role).toBe('customer');
        });

        it('should reject registration with duplicate email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Duplicate Guy',
                    email: 'customer@example.com', // Seed email
                    password: 'password123'
                });

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it('should successfully log in as seed Customer 1', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'customer@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            customerToken = res.body.data.token;
        });

        it('should successfully log in as seed Customer 2', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'alice@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            customer2Token = res.body.data.token;
        });

        it('should successfully log in as seed Support Agent', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'agent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.user.role).toBe('agent');
            agentToken = res.body.data.token;
        });

        it('should reject login with wrong password (401)', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'customer@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('Invalid email or password');
        });
    });

    // ----------------------------------------------------
    // 3. SECURITY & MIDDLEWARE CHECKS
    // ----------------------------------------------------
    describe('Security & Authorization Middleware', () => {
        it('should reject request without authentication token (401)', async () => {
            const res = await request(app).get('/api/tickets');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject request with invalid/malformed JWT token (401)', async () => {
            const res = await request(app)
                .get('/api/tickets')
                .set('Authorization', 'Bearer invalid_fake_token_123');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject Customer accessing Agent-only endpoint GET /api/users (403)', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('Forbidden');
        });

        it('should allow Agent accessing GET /api/users', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${agentToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    // ----------------------------------------------------
    // 4. TICKET OPERATIONS & OWNERSHIP CHECKS
    // ----------------------------------------------------
    describe('Ticket APIs', () => {
        it('should allow Customer 1 to create a ticket', async () => {
            const res = await request(app)
                .post('/api/tickets')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    subject: 'Cannot login to mobile app',
                    description: 'The app keeps crashing when clicking login button.',
                    priority: 'high'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id');
            createdTicketId = res.body.data.id;
        });

        it('should validate ticket input fields (400 if subject missing)', async () => {
            const res = await request(app)
                .post('/api/tickets')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    description: 'Missing subject field test'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toContain('Subject is required');
        });

        it('should return ONLY Customer 1 tickets when Customer 1 queries GET /api/tickets', async () => {
            const res = await request(app)
                .get('/api/tickets')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            // Customer 1 owns ticket 1, 2, and createdTicketId. All returned tickets must belong to user 1.
            res.body.data.forEach(t => {
                expect(t.user_id).toBe(1);
            });
        });

        it('should reject Customer 2 accessing Customer 1 ticket (403 Forbidden)', async () => {
            // Customer 1 owns ticket 1
            const res = await request(app)
                .get('/api/tickets/1')
                .set('Authorization', `Bearer ${customer2Token}`); // Customer 2 token

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('Forbidden');
        });

        it('should allow Agent to access any customer ticket', async () => {
            const res = await request(app)
                .get('/api/tickets/1')
                .set('Authorization', `Bearer ${agentToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(1);
        });

        it('should return 404 for non-existent ticket ID', async () => {
            const res = await request(app)
                .get('/api/tickets/9999')
                .set('Authorization', `Bearer ${agentToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toContain('Ticket not found');
        });

        it('should allow Agent to update ticket status, priority, and assignment', async () => {
            const res = await request(app)
                .put('/api/tickets/1')
                .set('Authorization', `Bearer ${agentToken}`)
                .send({
                    status: 'in_progress',
                    priority: 'high',
                    assigned_to: 3
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe('in_progress');
            expect(res.body.data.assigned_to).toBe(3);
        });
    });

    // ----------------------------------------------------
    // 5. COMMENT APIs
    // ----------------------------------------------------
    describe('Comment Endpoints', () => {
        it('should allow Customer 1 to add a comment to their ticket', async () => {
            const res = await request(app)
                .post('/api/tickets/1/comments')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    comment: 'Updating with screenshot details...'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.comment).toContain('screenshot');
        });

        it('should allow Agent to add a comment response', async () => {
            const res = await request(app)
                .post('/api/tickets/1/comments')
                .set('Authorization', `Bearer ${agentToken}`)
                .send({
                    comment: 'We have received your update and are processing it.'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.user_role).toBe('agent');
        });

        it('should reject Customer 2 commenting on Customer 1 ticket (403)', async () => {
            const res = await request(app)
                .post('/api/tickets/1/comments')
                .set('Authorization', `Bearer ${customer2Token}`)
                .send({
                    comment: 'Unauthorized comment attempt'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('should fetch all comments for ticket 1', async () => {
            const res = await request(app)
                .get('/api/tickets/1/comments')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    // ----------------------------------------------------
    // 6. REQUIRED JOIN QUERY & STATS APIs
    // ----------------------------------------------------
    describe('Required JOIN Query & Agent Stats', () => {
        it('should return open tickets with customer name and email using JOIN query', async () => {
            const res = await request(app)
                .get('/api/tickets?openWithCustomer=true')
                .set('Authorization', `Bearer ${agentToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            if (res.body.data.length > 0) {
                expect(res.body.data[0]).toHaveProperty('customer_name');
                expect(res.body.data[0]).toHaveProperty('email');
                expect(res.body.data[0]).toHaveProperty('subject');
                expect(res.body.data[0]).toHaveProperty('status');
            }
        });

        it('should return dashboard ticket stats for Agent', async () => {
            const res = await request(app)
                .get('/api/tickets/stats')
                .set('Authorization', `Bearer ${agentToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('total');
            expect(res.body.data).toHaveProperty('open');
            expect(res.body.data).toHaveProperty('in_progress');
            expect(res.body.data).toHaveProperty('closed');
            expect(res.body.data).toHaveProperty('high_priority');
        });
    });
});
