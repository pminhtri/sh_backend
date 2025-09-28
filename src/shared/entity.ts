export interface EntityModel {
  id: string;
}

export abstract class Entity<T extends EntityModel = EntityModel> {
  private _id: string;

  public get id() {
    return this._id;
  }

  constructor(id: string) {
    this._id = id;
  }

  public equal(other: Entity): boolean {
    return this.id === other.id;
  }

  public abstract toModel(): T;
}
