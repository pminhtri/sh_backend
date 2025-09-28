import { inject, injectable } from 'inversify';

import { IUserRepository, UserEntity } from '@/application/module/user/domain';
import { DBContext } from '@/infra';
import { User, UserDocument, UserSchema } from './schema';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(DBContext) protected readonly dbContext: DBContext) {
    this.dbContext.defineModels([{ name: 'User', schema: UserSchema }]);
  }

  protected get model() {
    return this.dbContext.model<UserDocument>('User');
  }

  private mapToEntity(user: User): UserEntity {
    return new UserEntity(
      user._id.toHexString(),
      user.email,
      user.password,
      user.roleIds.map((id) => id.toHexString()),
      user.activatedUser,
      user.createdAt,
      user.updatedAt
    );
  }

  public async getByEmail(email: string): Promise<UserEntity | null> {
    const userDoc = await this.model.findOne({ email }).lean<User>().exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  public async getById(id: string): Promise<UserEntity | null> {
    const userDoc = await this.model.findById(id).lean<User>().exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  public async getAll(): Promise<UserEntity[]> {
    const userDocs = await this.model.find().lean<User[]>().exec();
    return userDocs.map((user) => this.mapToEntity(user));
  }
}
