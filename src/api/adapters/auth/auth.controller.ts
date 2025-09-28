import { inject, injectable } from 'inversify';

import { BaseController } from '@/api/baseController';
import { AuthError, IAuthService } from '@/application/module/auth';
import { Request, Response } from '@/infra';
import { ServiceResponseStatus } from '@/types';
import { AuthDto } from './dtos';

@injectable()
export class AuthController extends BaseController {
  constructor(@inject('IAuthService') private readonly authService: IAuthService) {
    super();
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body as { email: string; password: string };

    const {
      status,
      result: authResult,
      error
    } = await this.authService.authenticate({
      email,
      password
    });

    if (status === ServiceResponseStatus.Failed || !authResult) {
      switch (error?.reason) {
        case AuthError.ACCOUNT_NOT_FOUND:
          return this.NotFoundResult(res, [
            {
              errorCode: error.reason,
              message: 'Account not found'
            }
          ]);
        case AuthError.INVALID_CREDENTIALS:
          return this.UnauthorizedResult(res, [
            {
              errorCode: error.reason,
              message: 'Invalid credentials'
            }
          ]);
        default:
          return this.ServerErrorResult(res, [
            {
              errorCode: 'UNEXPECTED_ERROR',
              message: 'An unexpected error occurred during authentication'
            }
          ]);
      }
    }

    return this.OkResult<AuthDto>(res, authResult);
  }
}
