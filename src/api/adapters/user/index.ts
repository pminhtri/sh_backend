import { appContainer } from '@/container';
import { UserController } from './user.controller';
import userRoutes from './user.route';

export function registerUserController() {
  appContainer.addSingletonScope<UserController>('UserController', UserController);
}

export { userRoutes };
