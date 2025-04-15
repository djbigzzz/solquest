const request = require('supertest');
const app = require('../src/server');

describe('SolQuest API Integration Tests', () => {
  it('should return healthy status from /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toMatch(/healthy/i);
  });

  it('should connect to the database via /api/db-connect', async () => {
    const res = await request(app).get('/api/db-connect');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database.status).toBe('connected');
  });

  it('should get all quests from /api/quests', async () => {
    const res = await request(app).get('/api/quests');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
