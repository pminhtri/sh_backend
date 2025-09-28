import { EntityModel } from '@/shared';

export interface UserModel extends EntityModel {
  email: string;
  roleIds: string[];
  activatedUser: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
