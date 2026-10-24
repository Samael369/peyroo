import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import type { HealthCheckResponse, ApiErrorResponse } from '@peyroo/shared';

export const app = express();

// Security Headers
app.use(helmet());

// CORS Whitelist
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  }),
);

// Body Parsing
app.use(express.json({ limit: '1mb' }));

// Minimal Health Check Endpoint
app.get('/health', (_req: Request, res: Response<HealthCheckResponse>) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: '@peyroo/api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
});

// 404 Catch-All Handler
app.use((_req: Request, res: Response<ApiErrorResponse>) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found.',
    },
  });
});

// Centralized Error Handling Middleware
app.use((err: unknown, _req: Request, res: Response<ApiErrorResponse>, _next: NextFunction) => {
  const isProduction = config.NODE_ENV === 'production';
  const message =
    err instanceof Error && !isProduction ? err.message : 'An unexpected internal error occurred.';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
  });
});
