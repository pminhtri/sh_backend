import { Entity } from '@/shared';
import { UserModel } from './model';

export class UserEntity extends Entity {
  constructor(
    id: string,
    public email: string,
    public password: string,
    public roleIds: string[],
    public activatedUser: boolean,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {
    super(id);
  }

  public toModel(): UserModel {
    return {
      id: this.id,
      email: this.email,
      roleIds: this.roleIds,
      activatedUser: this.activatedUser,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
