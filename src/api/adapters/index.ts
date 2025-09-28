import { createRoute } from '@/api/utils';
import { authRoutes, registerAuthController } from './auth';
import { registerUserController, userRoutes } from './user';

export function buildApiIocContainer() {
  registerUserController();
  registerAuthController();
}

export const apiRoutes = createRoute((router) => {
  router.register(userRoutes, { prefix: '/users' });
  router.register(authRoutes, { prefix: '/auth' });
});
