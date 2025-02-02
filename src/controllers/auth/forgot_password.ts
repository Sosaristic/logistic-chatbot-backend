import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { createJWT } from '../../utils/helpers';
import sendEmail from '../../services/send_email';
import { forgotPasswordBodySchema } from '../../validators/auth.validators';
import { sendResponse } from '../../utils/sendResponse';

const forgotPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = forgotPasswordBodySchema.parse(req.body);
    const { email } = data;
    const user = await UserModel.findOne({ email });
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

export default forgotPassword;
