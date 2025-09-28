import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { HttpError } from '@/infra';

export const errorHandler = fp((fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, _req, reply) => {
    if (error.validation) {
      reply.status(400).send({
        statusCode: 400,
        failures: error.validation.map((err) => ({
          errorCode: 'VALIDATION_ERROR',
          message: err.message
        }))
      });
    }

    if (error instanceof HttpError) {
      reply.status(error.statusCode).send(error.toJSON());
    } else {
      reply.status(500).send({
        statusCode: 500,
        message: 'Internal Server Error'
      });
    }
  });
});
