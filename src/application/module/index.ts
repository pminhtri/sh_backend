import { registerAuthModule } from './auth';
import { registerUserModule } from './user';

export function buildModulesIocContainer() {
  registerUserModule();
  registerAuthModule();
}
