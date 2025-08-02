import { Schema, model, models } from 'mongoose';
import bcryptjs from 'bcryptjs';
import { IUser } from './user.interface';
import { envVars } from '../../config/env';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        // Cast ret to any to allow delete
        const obj = ret as any;
        if (obj.password) delete obj.password;
        if (obj.__v !== undefined) delete obj.__v;
      },
    },
  }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (!this.password) {
    return next(new Error('Password is missing'));
  }

  try {
    const saltRounds = Number(envVars.BCRYPT_SALT_ROUND) || 10;
    this.password = await bcryptjs.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Add your method if needed here (optional)
// e.g., userSchema.methods.isPasswordMatched = async function(...) { ... }

export const User = models.User || model<IUser>('User', userSchema);
