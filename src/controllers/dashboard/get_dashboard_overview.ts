import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../../models/users.models';
import { Order } from '../../models/order.model';
import { sendResponse } from '../../utils/sendResponse';

const getDashboardOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const [totalUsers, totalOrders, users, orders] = await Promise.all([
      UserModel.countDocuments(), // Get total users count
      Order.countDocuments(), // Get total orders count
      UserModel.find().select('name email createdAt'), // Get all users (optimized)
      Order.find().select('userId totalAmount status createdAt'), // Get all orders (optimized)
    ]);

    sendResponse(res, 200, null, 'Dashboard', null);
  }
);

export default getDashboardOverview;
