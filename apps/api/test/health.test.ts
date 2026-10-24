import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('GET /health', () => {
  it('returns 200 OK with valid health status payload', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        status: 'ok',
        service: '@peyroo/api',
        version: '0.1.0',
      },
    });
    expect(response.body.data.timestamp).toBeDefined();
    expect(typeof response.body.data.uptimeSeconds).toBe('number');
  });

  it('returns 404 for unknown endpoints', async () => {
    const response = await request(app).get('/unknown-endpoint');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
      },
    });
  });
});
