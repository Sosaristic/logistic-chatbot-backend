import { Request, Response, NextFunction } from 'express';

import { ZodError } from 'zod';
import CustomError from '../lib/utils/error';
import { ErrorValidators } from '../validators/ErrorValidators';
import mongoose from 'mongoose';

type ErrorType = CustomError & ZodError;

const errorController = (
  error: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validator = new ErrorValidators(res, error);

  if (error.name == 'ZodError') {
    return validator.zodValidator();
  } else if (error.isOperational) {
    return validator.customValidator();
  } else if (error instanceof mongoose.Error.CastError) {
    return validator.mongooseValidator(); // Added method to handle Mongoose CastError
  } else if (error instanceof mongoose.Error.ValidationError) {
    return validator.mongooseValidator(); // Handle Mongoose ValidationError
  } else {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const errorHandlerMiddleware = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorController(err, req, res, next);
};

export default errorHandlerMiddleware;
