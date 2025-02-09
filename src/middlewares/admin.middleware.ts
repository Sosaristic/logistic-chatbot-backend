import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import CustomError from '../lib/utils/error';

export const adminMiddleWare = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;
    if (role !== 'admin') {
      throw new CustomError('unauthorized', 401);
    }
    next();
  }
);
