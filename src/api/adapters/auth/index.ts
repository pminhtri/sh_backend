import { appContainer } from '@/container';
import { AuthController } from './auth.controller';
import authRoutes from './auth.route';

export function registerAuthController() {
  appContainer.addSingletonScope<AuthController>('AuthController', AuthController);
}

export { authRoutes };
