import { Request, Response, NextFunction } from 'express';
import CustomError from '../lib/utils/error';
import {
  comparePassword,
  createJWT,
  hashPassword,
  verifyJWT,
} from '../utils/helpers';
import { VendorModel, VendorType } from '../models/vendors.models';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { AdminModel, AdminType } from '../models/admin.model';
export const authMiddleWare = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
      throw new CustomError('unauthorized', 401);
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.body = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        if (!refreshToken) {
          throw new CustomError('unauthorized', 401);
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const type = decoded.role;
        let user = {} as AdminType | VendorType;

        if (type === 'admin') {
          const user = await AdminModel.findById(decoded.userId);
        }
        if (type === 'vendor' || type === 'driver') {
          user = await VendorModel.findById(decoded.userId);
        }

        if (!user) {
          throw new CustomError('unauthorized', 401);
        }
        if (!comparePassword(refreshToken, user.refresh_token)) {
          throw new CustomError('unauthorized', 401);
        }

        const newAccessToken = createJWT(
          { userId: user._id.toString(), role: user.type },
          { expiresIn: '2m' }
        );
        const newRefreshToken = createJWT(
          { userId: user._id.toString(), role: user.type },
          { expiresIn: '7d' }
        );
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          maxAge: 5 * 60 * 1000,
          secure: true,
          sameSite: 'none',
          partitioned: true,
        });

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          secure: true,
          sameSite: 'none',
          partitioned: true,
        });

        const hashedToken = await hashPassword(refreshToken);
        user.refresh_token = hashedToken;
        await user.save();
        req.body = decoded;
        next();
      }
    }
  }
);
