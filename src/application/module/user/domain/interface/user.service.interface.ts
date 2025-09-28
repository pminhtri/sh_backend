import { UserModel } from '@/application/module/user/domain/entity';
import { ServiceResponse } from '@/types';

export interface IUserService {
  getUserById(id: string): Promise<ServiceResponse<UserModel | null>>;
  getUserByEmail(email: string): Promise<ServiceResponse<UserModel | null>>;
  getAllUsers(): Promise<ServiceResponse<UserModel[]>>;
}
