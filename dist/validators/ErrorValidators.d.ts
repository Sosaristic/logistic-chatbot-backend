import { ZodError } from 'zod';
import CustomError from '../lib/utils/error';
import { Response } from 'express';
type ErrorType = CustomError & ZodError;
export declare class ErrorValidators {
    private res;
    private error;
    constructor(res: Response, error: ErrorType);
    zodValidator(): Response<any, Record<string, any>>;
    customValidator(): Response<any, Record<string, any>>;
    mongooseValidator(): Response<any, Record<string, any>>;
}
export {};
