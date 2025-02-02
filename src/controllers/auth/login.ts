import { Request, Response } from 'express';
import { loginBodySchema } from '../../validators/auth.validators';
import { UserModel } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { comparePassword, hashPassword } from '../../utils/helpers';
import sendEmail from '../../services/send_email';
import { sendResponse } from '../../utils/sendResponse';

import expressAsyncHandler from 'express-async-handler';
import { createJWT } from '../../utils/helpers';

const login = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginBodySchema.parse(req.body);

  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomError('invalid credentials', 401);
  }

  const isPasswordMatched = comparePassword(password, user.password);
  if (!isPasswordMatched) {
    throw new CustomError('invalid credentials', 401);
  }

  if (!user.email_verified) {
    const token = createJWT(
      { userId: user._id.toString(), role: user.type },
      { expiresIn: '15m' }
    );
    const verificationLink = `${process.env.CLIENT_URL}/auth/verify_email?token=${token}`;
    sendEmail({
      templateName: 'verify-email',
      email,
      subject: 'Verify Your Email Address',
      variables: {
        name:
          user.type === 'vendor'
            ? user.vendor_name
            : `${user.first_name} ${user.last_name}`,

        verificationLink,
      },
    });
    throw new CustomError('email not verified', 401);
  }

  const accessToken = createJWT(
    { userId: user._id.toString(), role: 'vendor' },
    { expiresIn: '2m' }
  );
  const refreshToken = createJWT(
    { userId: user._id.toString(), role: 'vendor' },
    { expiresIn: '7d' }
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000,
    partitioned: true,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    partitioned: true,
  });
  const userData = {
    vendor_name: user.vendor_name,
  };

  const hashedToken = await hashPassword(refreshToken);

  user.refresh_token = hashedToken;

  await user.save();
  sendResponse(res, 200, userData, 'User logged in successfully', null);
});

export default login;
