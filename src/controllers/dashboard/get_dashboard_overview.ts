import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../../models/users.models';
import { Order } from '../../models/order.model';
import { sendResponse } from '../../utils/sendResponse';
import { getDashboardData } from '../../utils/getDashboardData';

const getDashboardOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getDashboardData();

    sendResponse(res, 200, data, 'Dashboard', null);
  }
);

export default getDashboardOverview;
