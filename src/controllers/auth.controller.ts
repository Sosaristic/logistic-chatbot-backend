import { Request, Response } from 'express';
import {
  forgotPasswordBodySchema,
  loginBodySchema,
  resetPasswordBodySchema,
  signUpBodySchema,
  verifyEmailBodySchema,
} from '../validators/auth.validators';
import asyncHandler from 'express-async-handler';
import { VendorModel, VendorType } from '../models/vendors.models';
import CustomError from '../lib/utils/error';
import {
  comparePassword,
  createJWT,
  generateRandomString,
  hashAPIKey,
  hashPassword,
  verifyJWT,
} from '../utils/helpers';
import sendEmail from '../services/send_email';
import { sendResponse } from '../utils/sendResponse';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginBodySchema.parse(req.body);

  const user = await VendorModel.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomError('invalid credentials', 401);
  }

  const isPasswordMatched = comparePassword(password, user.password);
  if (!isPasswordMatched) {
    throw new CustomError('invalid credentials', 401);
  }

  if (!user.email_verified) {
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
    userId: user._id.toString(),
    email: user.email,
    vendor_name: user.vendor_name,
  };

  const hashedToken = await hashPassword(refreshToken);

  user.refresh_token = hashedToken;

  await user.save();
  sendResponse(res, 200, userData, 'User logged in successfully', null);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = signUpBodySchema.parse(req.body);

  const { email, password, type } = data;
  console.log(data, 'data');

  const existingUser = await VendorModel.findOne({ email });

  if (existingUser) {
    throw new CustomError('User already exists', 409);
  }

  const hashedPass = await hashPassword(password);

  let user: VendorType = {} as VendorType;

  if (type === 'vendor') {
    const { vendor_name } = data;
    user = await VendorModel.create({
      email,
      password: hashedPass,
      type,
      vendor_name,
    });
  }

  if (type === 'driver') {
    const { first_name, last_name } = data;
    user = await VendorModel.create({
      email,
      type,
      password: hashedPass,
      first_name,
      last_name,
    });
  }

  const token = createJWT(
    { userId: user._id.toString(), role: type },
    { expiresIn: '15m' }
  );

  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  sendEmail({
    templateName: 'verify-email',
    email,
    subject: 'Verify Your Email Address',
    variables: {
      name:
        type === 'vendor'
          ? user.vendor_name
          : `${user.first_name} ${user.last_name}`,

      verificationLink,
    },
  });

  sendResponse(res, 201, null, 'User created successfully', null);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const data = verifyEmailBodySchema.parse(req.body);
  const { token } = data;

  const decoded = verifyJWT(token);

  const apiKey = generateRandomString(32);
  const hashedApi = hashAPIKey(apiKey);

  const user = await VendorModel.findByIdAndUpdate(decoded.userId, {
    email_verified: true,
    api_key: hashedApi,
  });

  sendEmail({
    templateName: 'email-verified',
    email: user.email,
    subject: 'Email Verified',
    variables: {
      name: user.vendor_name,
      loginUrl: `${process.env.CLIENT_URL}/login`,
    },
  });
  sendResponse(res, 200, null, 'Email has successfully been verified');
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = forgotPasswordBodySchema.parse(req.body);
    const { email } = data;
    const user = await VendorModel.findOne({ email });
    if (!user) {
      throw new CustomError('User not found', 401);
    }

    const token = createJWT(
      {
        userId: user._id.toString(),
      },
      { expiresIn: '5m' }
    );

    const link = `${process.env.CLIENT_URL}/forgot-password?token=${token}`;

    sendEmail({
      templateName: 'forgot-password',
      subject: 'Reset Password',
      email: user.email,
      variables: {
        name: user.vendor_name,
        resetUrl: link,
      },
    });

    sendResponse(res, 200, null, 'Verification link has been sent', null);
  }
);

//reset password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = resetPasswordBodySchema.parse(req.body);
    const { password, token } = data;

    const decoded = verifyJWT(token);

    const user = await VendorModel.findById(decoded.userId);

    if (!user) {
      throw new CustomError('User not found', 401);
    }

    const hashedPass = await hashPassword(password);

    await VendorModel.findByIdAndUpdate(user._id, { password: hashedPass });

    sendResponse(res, 200, null, 'Password has been reset', null);
  }
);

//logout
// post
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const decoded = verifyJWT(accessToken);
  const user = await VendorModel.findById(decoded.userId);
  if (!user) {
    throw new CustomError('User not found', 401);
  }
  user.refresh_token = '';

  await user.save();
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  sendResponse(res, 200, null, 'User logged out successfully', null);
});
