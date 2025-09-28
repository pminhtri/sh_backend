export interface UserDto {
  id: string;
  email: string;
  roleIds: string[];
  activatedUser: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
