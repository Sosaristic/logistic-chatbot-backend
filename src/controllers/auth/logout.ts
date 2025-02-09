import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { createJWT, verifyJWT } from '../../utils/helpers';
import { sendResponse } from '../../utils/sendResponse';

const logout = expressAsyncHandler(async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  console.log(accessToken, 'access token');

  const decoded = verifyJWT(accessToken);
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new CustomError('User not found', 401);
  }
  user.refresh_token = '';

  await user.save();
  res.cookie('accessToken', '', {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
  });
  sendResponse(res, 200, null, 'User logged out successfully', null);
});

export default logout;
