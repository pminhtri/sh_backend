import { FastifyInstance } from 'fastify';

export function createRoute(routeHandler: (router: FastifyInstance) => void): (router: FastifyInstance) => void {
  return (router: FastifyInstance) => {
    routeHandler(router);
  };
}
