import { compare } from 'bcrypt';
import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';

import { AuthError } from '@/application/module/auth/auth.error';
import { AuthModel, CredentialDataModel, IAuthService, TokenDataModel } from '@/application/module/auth/domain';
import { IUserRepository } from '@/application/module/user';
import { IConfigService } from '@/config';
import { ServiceResponse, ServiceResponseStatus } from '@/types';

@injectable()
export class AuthService implements IAuthService {
  private readonly secret: Uint8Array;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly expiresIn: string;

  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository,
    @inject('IConfigService') private readonly configService: IConfigService
  ) {
    this.secret = new TextEncoder().encode(this.configService.get('JWT_SECRET'));
    this.issuer = this.configService.get('JWT_ISSUER');
    this.audience = this.configService.get('JWT_AUDIENCE');
    this.expiresIn = this.configService.get('JWT_EXPIRES_IN');
  }

  public async authenticate(credential: CredentialDataModel): Promise<ServiceResponse<AuthModel>> {
    const { email, password } = credential;
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        error: { reason: AuthError.ACCOUNT_NOT_FOUND }
      };
    }

    if (!user.activatedUser) {
      return {
        status: ServiceResponseStatus.Failed,
        error: { reason: AuthError.LOGIN_NOT_ALLOWED }
      };
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: ServiceResponseStatus.Failed,
        error: { reason: AuthError.INVALID_CREDENTIALS }
      };
    }

    const token = await this.generateToken({
      id: user.id,
      email: user.email,
      roleIds: user.roleIds
    });

    return {
      status: ServiceResponseStatus.Success,
      result: { accessToken: token }
    };
  }

  private async generateToken(data: TokenDataModel): Promise<string> {
    return await new SignJWT(data)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(this.expiresIn)
      .sign(this.secret);
  }
}
