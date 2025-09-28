import { inject, injectable } from 'inversify';

import { BaseController } from '@/api/baseController';
import { IUserService } from '@/application/module/user';
import { Request, Response } from '@/infra';
import { ServiceResponseStatus } from '@/types';
import { UserDto } from './dtos';
import { mapUserModelToDto } from './mappers';

@injectable()
export class UserController extends BaseController {
  constructor(@inject('IUserService') private readonly userService: IUserService) {
    super();
  }

  public async getAllUsers(_: Request, res: Response) {
    const { status, result: users, error } = await this.userService.getAllUsers();

    if (status === ServiceResponseStatus.Failed || !users) {
      return this.NotFoundResult(res, [
        {
          errorCode: error?.reason,
          message: error?.message
        }
      ]);
    }

    return this.OkResult<UserDto[]>(
      res,
      users.map((user) => mapUserModelToDto(user))
    );
  }

  public async getUserById(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };

    const { status, result: user, error } = await this.userService.getUserById(userId);
    if (status === ServiceResponseStatus.Failed || !user) {
      return this.NotFoundResult(res, [
        {
          errorCode: error?.reason,
          message: error?.message
        }
      ]);
    }

    return this.OkResult<UserDto>(res, mapUserModelToDto(user));
  }
}
