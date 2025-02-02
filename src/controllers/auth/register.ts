import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { signUpBodySchema } from '../../validators/auth.validators';
import { UserModel, UserType } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { createJWT, hashPassword, verifyJWT } from '../../utils/helpers';
import sendEmail from '../../services/send_email';
import { sendResponse } from '../../utils/sendResponse';
const register = expressAsyncHandler(async (req: Request, res: Response) => {
  const data = signUpBodySchema.parse(req.body);

  const { email, password, type } = data;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new CustomError('User already exists', 409);
  }

  const hashedPass = await hashPassword(password);

  let user: UserType = {} as UserType;

  if (type === 'vendor') {
    const { vendor_name } = data;
    user = await UserModel.create({
      email,
      password: hashedPass,
      type,
      vendor_name,
    });
  }

  if (type === 'driver') {
    const { first_name, last_name } = data;
    user = await UserModel.create({
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

  const verificationLink = `${process.env.CLIENT_URL}/auth/verify_email?token=${token}`;

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

export default register;
