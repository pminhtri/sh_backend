import { inject, injectable } from 'inversify';

import { IUserRepository, IUserService, UserModel } from '@/application/module/user/domain';
import { UserError } from '@/application/module/user/user.error';
import { ServiceResponse, ServiceResponseStatus } from '@/types';

@injectable()
export class UserService implements IUserService {
  constructor(@inject('IUserRepository') protected readonly userRepository: IUserRepository) {}

  public async getUserById(id: string): Promise<ServiceResponse<UserModel | null>> {
    const user = await this.userRepository.getById(id);

    if (!user)
      return {
        status: ServiceResponseStatus.Failed,
        error: {
          reason: UserError.USER_NOT_FOUND,
          message: `User with id ${id} not found`
        }
      };

    return {
      status: ServiceResponseStatus.Success,
      result: user.toModel()
    };
  }

  public async getUserByEmail(email: string): Promise<ServiceResponse<UserModel | null>> {
    const user = await this.userRepository.getByEmail(email);

    if (!user)
      return {
        status: ServiceResponseStatus.Failed,
        error: {
          reason: UserError.USER_NOT_FOUND,
          message: `User with email ${email} not found`
        }
      };

    return {
      status: ServiceResponseStatus.Success,
      result: user.toModel()
    };
  }

  public async getAllUsers(): Promise<ServiceResponse<UserModel[]>> {
    const users = await this.userRepository.getAll();

    return {
      status: ServiceResponseStatus.Success,
      result: users.map((user) => user.toModel())
    };
  }
}
