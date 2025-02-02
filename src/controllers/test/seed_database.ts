import { Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import { hashPassword } from '../../utils/helpers';
import { AdminModel } from '../../models/admin.model';
import { sendResponse } from '../../utils/sendResponse';

export const seedDatabase = asyncHandler(
  async (req: Request, res: Response) => {
    const adminData = {
      email: 'sundayomena2@gmail.com',
      password: 'Password123@', // Hash this in a real scenario
      email_verified: true,
      refresh_token: null,
      type: 'admin',
    };

    const hashedPass = await hashPassword(adminData.password);
    adminData.password = hashedPass;
    await AdminModel.create(adminData);

    sendResponse(res, 200, null, 'Database seeded successfully', null);
  }
);
