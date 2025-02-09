import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel, UserType } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { createJWT, verifyJWT } from '../../utils/helpers';
import { sendResponse } from '../../utils/sendResponse';
import { AdminModel, AdminType } from '../../models/admin.model';

const logout = expressAsyncHandler(async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;

  const decoded = verifyJWT(accessToken);

  let user = {} as UserType | AdminType;
  if (decoded.role === 'admin') {
    user = await AdminModel.findById(decoded.userId);
  }
  if (decoded.role === 'vendor' || decoded.role === 'driver') {
    user = await UserModel.findById(decoded.userId);
  }
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
