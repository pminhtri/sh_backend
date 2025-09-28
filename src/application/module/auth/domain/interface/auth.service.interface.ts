import { AuthModel, CredentialDataModel } from '@/application/module/auth/domain/entity';
import { ServiceResponse } from '@/types';

export interface IAuthService {
  authenticate(credential: CredentialDataModel): Promise<ServiceResponse<AuthModel>>;
}
