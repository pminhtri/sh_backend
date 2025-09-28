import { UserModel } from '@/application/module/user';
import { UserDto } from './dtos';

export function mapUserModelToDto(user: UserModel): UserDto {
  return {
    id: user.id,
    email: user.email,
    roleIds: user.roleIds,
    activatedUser: user.activatedUser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
