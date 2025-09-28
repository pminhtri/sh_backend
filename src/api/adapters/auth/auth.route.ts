import { createRoute } from '@/api/utils';
import { appContainer } from '@/container';
import { AuthController } from './auth.controller';

const authRoutes = createRoute((router) => {
  const authController = appContainer.get(AuthController);

  router.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              errorMessage: {
                format: 'Invalid email address'
              }
            },
            password: {
              type: 'string',
              minLength: 8,
              errorMessage: {
                minLength: 'Password must be at least 8 characters long'
              }
            }
          },
          errorMessage: {
            required: {
              email: 'Email is required',
              password: 'Password is required'
            }
          }
        }
      }
    },
    async (req, res) => authController.login(req, res)
  );
});

export default authRoutes;
