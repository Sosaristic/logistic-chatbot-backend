import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { createJWT, verifyJWT } from '../../utils/helpers';
import { sendResponse } from '../../utils/sendResponse';

const logout = expressAsyncHandler(async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const decoded = verifyJWT(accessToken);
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new CustomError('User not found', 401);
  }
  user.refresh_token = '';

  await user.save();
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  sendResponse(res, 200, null, 'User logged out successfully', null);
});

export default logout;
