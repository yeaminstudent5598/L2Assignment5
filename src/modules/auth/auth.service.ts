import bcryptjs from 'bcryptjs';
import { User } from '../auth/auth.model';
import { generateToken, verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';

export const AuthService = {
  register: async (userData: { phoneNumber: string; password: string; role: string; name: string }) => {
    const { phoneNumber, password, role, name } = userData;

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      throw new AppError(400, 'User with this phone number already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

    const user = await User.create({
      name,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    const userObj = user.toObject() as any;
    delete userObj.password;
    return userObj;
  },

 login: async (loginData: { email: string; password: string }) => {
  const { email, password } = loginData;


  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (!user.password) {
    throw new AppError(401, 'Password not set for this user');
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const accessToken = generateToken(
    { userId: user._id.toString(), role: user.role },
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    { userId: user._id.toString(), role: user.role },
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
},


  getNewAccessToken: async (refreshToken: string) => {
    if (!refreshToken) {
      throw new AppError(400, 'Refresh token is required');
    }

    let decoded: any;
    try {
      decoded = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AppError(401, 'Invalid refresh token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const accessToken = generateToken(
      { userId: user._id.toString(), role: user.role },
      envVars.JWT_ACCESS_SECRET,
      envVars.JWT_ACCESS_EXPIRES
    );

    return {
      accessToken,
    };
  },

  resetPassword: async (
    oldPassword: string,
    newPassword: string,
    user: { id: string; role: string }
  ) => {
    const userId = user?.id;
    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const foundUser = await User.findById(userId).select('+password');
    if (!foundUser) {
      throw new AppError(404, 'User not found');
    }

    if (!foundUser.password) {
      throw new AppError(400, 'Password not set for this user');
    }

    const isOldPasswordValid = await bcryptjs.compare(oldPassword, foundUser.password);
    if (!isOldPasswordValid) {
      throw new AppError(400, 'Old password is incorrect');
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
    foundUser.password = hashedNewPassword;
    await foundUser.save();

    return { message: 'Password changed successfully' };
  },
};
