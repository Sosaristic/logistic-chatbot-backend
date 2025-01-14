import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import CustomError from '../lib/utils/error';
type ErrorType = CustomError & ZodError;
declare const errorHandlerMiddleware: (err: ErrorType, req: Request, res: Response, next: NextFunction) => void;
export default errorHandlerMiddleware;
