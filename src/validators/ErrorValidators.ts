import { ZodError } from 'zod';
import CustomError from '../lib/utils/error';
import { Response } from 'express';
import mongoose from 'mongoose';

type ErrorType = CustomError & ZodError;

export class ErrorValidators {
  constructor(private res: Response, private error: ErrorType) {
    this.res = res;
    this.error = error;
  }

  zodValidator() {
    const { errors } = this.error;

    const message = errors.map((error) => error.message).join(',');
    return this.res
      .status(400)
      .json({ status: 'invalid_input', message, statusCode: 400 });
  }

  customValidator() {
    const error = this.error;
    const message = error.message;
    const statusCode = error.statusCode;
    return this.res.status(error.statusCode).json({
      status: error.status,
      message,
      statusCode,
    });
  }

  // Mongoose error handling (CastError, ValidationError)
  mongooseValidator() {
    if (this.error instanceof mongoose.Error.CastError) {
      const message = `Invalid ${this.error.path} format`; // Example: Invalid ObjectId format
      return this.res.status(400).json({
        status: 'invalid_input',
        message,
        statusCode: 400,
      });
    }

    if (this.error instanceof mongoose.Error.ValidationError) {
      const message = Object.values(this.error.errors)
        .map((err) => err.message)
        .join(',');
      return this.res.status(400).json({
        status: 'validation_error',
        message,
        statusCode: 400,
      });
    }

    // In case the error is another type of mongoose error
    return this.res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}
