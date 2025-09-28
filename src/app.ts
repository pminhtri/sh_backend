import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import ajvErrors from 'ajv-errors';
import Fastify, { FastifyInstance } from 'fastify';

import { apiRoutes } from './api';
import { IConfigService } from './config';
import { appContainer } from './container';
import { errorHandler } from './error';
import { DBContext } from './infra';

export class App {
  private readonly app: FastifyInstance;
  private readonly configService: IConfigService;

  constructor(configService: IConfigService) {
    this.app = Fastify({
      trustProxy: true,
      ajv: { customOptions: { allErrors: true, removeAdditional: true }, plugins: [ajvErrors] }
    });
    this.configService = configService;
    this.initMiddlewares();
    this.setupRoutes();
  }

  private initMiddlewares() {
    this.app.register(helmet, {
      global: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:']
        }
      }
    });

    this.app.register(cors, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });

    this.app.register(rateLimit, {
      max: 1000, // Limit each IP to 1000 requests per timeWindow
      timeWindow: 1 * 60 * 1000, // 1 minute
      keyGenerator: (req) => req.ip, // Use IP address as the key
      skipOnError: true // Skip rate limiting on error responses
    });

    this.app.register(errorHandler);
  }

  private setupRoutes() {
    this.app.register(apiRoutes, {
      prefix: '/api'
    });
  }

  private async connectDB() {
    const db = appContainer.get(DBContext);
    try {
      await db.connect();
      console.info('Database connected successfully');
    } catch (error) {
      console.error({
        message: 'Database connection failed',
        error
      });
      process.exit(1);
    }
  }

  public async run() {
    await this.connectDB();

    await this.app.listen({
      host: this.configService.get<string>('HOST'),
      port: this.configService.get<number>('PORT')
    });

    console.info(`Server is running on port ${this.configService.get<number>('PORT') || 3000}`);
  }
}
