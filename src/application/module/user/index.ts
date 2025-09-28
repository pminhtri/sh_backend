import { appContainer } from '@/container';
import { IUserRepository, IUserService } from './domain';
import { UserRepository } from './repository';
import { UserService } from './service';

export function registerUserModule() {
  appContainer.addSingletonScope<IUserRepository>('IUserRepository', UserRepository);
  appContainer.addSingletonScope<IUserService>('IUserService', UserService);
}

export * from './domain';
export * from './user.error';
