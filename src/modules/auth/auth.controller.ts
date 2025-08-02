import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';
import { AuthService } from './auth.service';

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and password are required');
  }


  const user = await AuthService.login({ email, password });

  setAuthCookie(res, {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      user: user.user,
    },
  });
});


const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No refresh token received from cookies');
  }

  const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

  setAuthCookie(res, {
    accessToken: tokenInfo.accessToken,
    refreshToken, // you might want to issue a new refreshToken as well depending on your logic
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'New access token retrieved successfully',
    data: tokenInfo,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user; 
  console.log('Decoded User:', req.user);
  if (!decodedToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  await AuthService.resetPassword(oldPassword, newPassword, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: null,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  console.log('Logout called');
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers.authorization);

  res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax' });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged out successfully',
    data: null,
  });
});


export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  logout,
};
