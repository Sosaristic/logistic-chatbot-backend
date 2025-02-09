import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../../models/users.models';
import { Order } from '../../models/order.model';
import { sendResponse } from '../../utils/sendResponse';

const getDashboardOverview = asyncHandler(
  async (req: Request, res: Response) => {
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
          },
        },
      ]),
    ]);

    const parsedUser = overViewData[0][0];
    const parsedOrder = overViewData[1][0];
    console.log(parsedOrder);
    console.log(parsedUser);

    const data = {
      totalVendors:
        parsedUser.totalVendors.length > 0
          ? parsedUser.totalVendors[0].count
          : 0,
      totalDrivers:
        parsedUser.totalDrivers.length > 0
          ? parsedUser.totalDrivers[0].count
          : 0,
      totalDeliveries:
        parsedOrder.deliveries.length > 0 ? parsedOrder.deliveries[0].count : 0,
    };

    sendResponse(res, 200, data, 'Dashboard', null);
  }
);

export default getDashboardOverview;
