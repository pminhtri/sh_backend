import { appContainer } from '@/container';
import { IAuthService } from './domain';
import { AuthService } from './service';

export function registerAuthModule() {
  appContainer.addSingletonScope<IAuthService>('IAuthService', AuthService);
}

export * from './auth.error';
export * from './domain';
