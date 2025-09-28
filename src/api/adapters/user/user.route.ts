import { createRoute } from '@/api/utils';
import { appContainer } from '@/container';
import { UserController } from './user.controller';

const userRoutes = createRoute((router) => {
  const userController = appContainer.get(UserController);

  router.get('/:userId', async (req, res) => userController.getUserById(req, res));
  router.get('/', async (req, res) => userController.getAllUsers(req, res));
});

export default userRoutes;
