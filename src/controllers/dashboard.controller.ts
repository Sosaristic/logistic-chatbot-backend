import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../utils/sendResponse';
import { Order } from '../models/order.model';
import { VendorModel } from '../models/vendors.models';

export const getDashboardOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const [totalUsers, totalOrders, users, orders] = await Promise.all([
      VendorModel.countDocuments(), // Get total users count
      Order.countDocuments(), // Get total orders count
      VendorModel.find().select('name email createdAt'), // Get all users (optimized)
      Order.find().select('userId totalAmount status createdAt'), // Get all orders (optimized)
    ]);

    console.log(totalOrders, totalUsers, users, orders);

    sendResponse(res, 200, null, 'Dashboard', null);
  }
);
