const request = require('supertest');
const app = require('../app');

describe('Health Endpoint (/api/health)', () => {
    it('returns status ok and 200 code', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});
