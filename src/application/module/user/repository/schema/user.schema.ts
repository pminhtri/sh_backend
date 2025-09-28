import { HydratedDocument, Schema, Types } from 'mongoose';

interface User {
  _id: Types.ObjectId;
  email: string;
  password: string;
  roleIds: Types.ObjectId[];
  activatedUser: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true
    },
    roleIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
    ],
    activatedUser: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.virtual('userGeneral', {
  ref: 'UserGeneralInformation',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

UserSchema.virtual('userJob', {
  ref: 'UserJobInformation',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

UserSchema.set('toJSON', { virtuals: true });

type UserDocument = HydratedDocument<typeof UserSchema>;

export { User, UserDocument, UserSchema };
