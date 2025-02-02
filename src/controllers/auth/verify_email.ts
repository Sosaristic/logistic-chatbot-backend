import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import {
  createJWT,
  generateRandomString,
  hashAPIKey,
  verifyJWT,
} from '../../utils/helpers';
import sendEmail from '../../services/send_email';
import { sendResponse } from '../../utils/sendResponse';
import { verifyEmailBodySchema } from '../../validators/auth.validators';

const verifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
  const data = verifyEmailBodySchema.parse(req.body);
  const { token } = data;

  const decoded = verifyJWT(token);

  const apiKey = generateRandomString(32);
  const hashedApi = hashAPIKey(apiKey);

  const user = await UserModel.findByIdAndUpdate(decoded.userId, {
    email_verified: true,
    ...(decoded.role === 'vendor' && { api_key: hashedApi }),
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

export default verifyEmail;
