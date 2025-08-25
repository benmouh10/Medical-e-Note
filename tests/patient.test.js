const request = require('supertest');
const app = require('../app');

describe("GET /api/patients", () => {
  it("should return patients list", async () => {
    const res = await request(app).get('/api/patients');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
