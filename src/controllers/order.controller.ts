import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createOrderBodySchema } from '../validators/order.validator';
import CustomError from '../lib/utils/error';
import { VendorModel } from '../models/vendors.models';
import { generateTrackingId, hashAPIKey } from '../utils/helpers';
import { sendResponse } from '../utils/sendResponse';
import { Order } from '../models/order.model';

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = createOrderBodySchema.parse(req.body);

  if (!req.headers.authorization) {
    throw new CustomError('Unauthorized', 401);
  }

  const apiKey = req.headers.authorization.split(' ')[1];

  if (!apiKey) {
    throw new CustomError('Unauthorized', 401);
  }

  const vendor = await VendorModel.findOne({ api_key: apiKey });

  if (!vendor) {
    throw new CustomError('Unauthorized', 401);
  }

  const order = await Order.create({
    contact: data.contact,
    products: data.products,
    totalAmount: data.totalAmount,
    date: data.date,
    status: 'pending',
    vendor: vendor._id,
    trackingId: generateTrackingId(12),
  });

  await order.save();

  sendResponse(
    res,
    200,
    { tracking_id: order.trackingId },
    'Order placed successfully',
    null
  );
});
