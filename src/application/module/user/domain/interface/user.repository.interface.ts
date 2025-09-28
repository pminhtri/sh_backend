import { UserEntity } from '@/application/module/user/domain/entity';

export interface IUserRepository {
  getById(id: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[]>;
}
