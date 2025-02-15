import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { AdminModel } from '../../models/admin.model';
import CustomError from '../../lib/utils/error';
import { comparePassword, hashPassword } from '../../utils/helpers';
import { createJWT } from '../../utils/helpers';
import { sendResponse } from '../../utils/sendResponse';
import { UserModel } from '../../models/users.models';
import { Order } from '../../models/order.model';

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

  const overViewData = await Promise.all([
    UserModel.aggregate([
      {
        $facet: {
          totalVendors: [
            { $match: { type: 'vendor', email_verified: true } },
            { $count: 'count' },
          ],
          totalDrivers: [
            { $match: { type: 'driver', email_verified: true } },
            { $count: 'count' },
          ],
        },
      },
    ]),
    Order.aggregate([
      {
        $facet: {
          deliveries: [{ $count: 'count' }],
          shipments: [{ $match: { status: 'delivered'} }],
        },
      },
    ]),
  ]);

  const parsedUser = overViewData[0][0];
  const parsedOrder = overViewData[1][0];

  const data = {
    totalVendors:
      parsedUser.totalVendors.length > 0 ? parsedUser.totalVendors[0].count : 0,
    totalDrivers:
      parsedUser.totalDrivers.length > 0 ? parsedUser.totalDrivers[0].count : 0,
    totalDeliveries:
      parsedOrder.deliveries.length > 0 ? parsedOrder.deliveries[0].count : 0,
    totalShipments: parsedOrder.shipments,
  };

  sendResponse(res, 200, data, 'User logged in successfully', null);
});

export default adminLogin;
