import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { AdminModel } from '../../models/admin.model';
import CustomError from '../../lib/utils/error';
import { comparePassword, hashPassword } from '../../utils/helpers';
import { createJWT } from '../../utils/helpers';
import { sendResponse } from '../../utils/sendResponse';

const adminLogin = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await AdminModel.findOne({ email });

  if (!user) {
    throw new CustomError('invalid credentials', 401);
  }

  const isPasswordMatched = comparePassword(password, user.password);
  if (!isPasswordMatched) {
    throw new CustomError('invalid credentials', 401);
  }

  const accessToken = createJWT(
    { userId: user._id.toString(), role: 'admin' },
    { expiresIn: '15m' }
  );
  const refreshToken = createJWT(
    { userId: user._id.toString(), role: 'admin' },
    { expiresIn: '7d' }
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000,
    partitioned: true,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    partitioned: true,
  });

  const hashedToken = await hashPassword(refreshToken);

  user.refresh_token = hashedToken;

  sendResponse(res, 200, null, 'User logged in successfully', null);
});

export default adminLogin;
