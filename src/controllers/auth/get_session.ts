import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { UserModel, UserType } from '../../models/users.models';
import CustomError from '../../lib/utils/error';
import { verifyJWT } from '../../utils/helpers';
import { sendResponse } from '../../utils/sendResponse';
import { AdminModel, AdminType } from '../../models/admin.model';
import { getDashboardData } from '../../utils/getDashboardData';

const getSession = expressAsyncHandler(async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new CustomError('unauthorized', 401);
  }

  const decoded = verifyJWT(accessToken);

  let user = {} as AdminType | UserType;
  if (decoded.role === 'admin') {
    user = await AdminModel.findById(decoded.userId);
  }
  if (decoded.role === 'vendor' || decoded.role === 'driver') {
    user = await UserModel.findById(decoded.userId);
  }

  if (!user) {
    throw new CustomError('User not found', 401);
  }
  if (user.type === 'admin') {
    const data = await getDashboardData();
    sendResponse(res, 200, data, 'User logged in successfully', null);
  }
  if (user.type === 'vendor' || user.type === 'driver') {
    const userData = {
      vendor_name: user.vendor_name,
    };
    sendResponse(res, 200, userData, 'User logged in successfully', null);
  }
});

export default getSession;
