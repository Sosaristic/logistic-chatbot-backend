import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { createJWT, hashPassword, verifyJWT } from '../../utils/helpers';

import { resetPasswordBodySchema } from '../../validators/auth.validators';
import { sendResponse } from '../../utils/sendResponse';

const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = resetPasswordBodySchema.parse(req.body);
    const { password, token } = data;

    const decoded = verifyJWT(token);

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      throw new CustomError('User not found', 401);
    }

    const hashedPass = await hashPassword(password);

    await UserModel.findByIdAndUpdate(user._id, { password: hashedPass });

    sendResponse(res, 200, null, 'Password has been reset', null);
  }
);

export default resetPassword;
