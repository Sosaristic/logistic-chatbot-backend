import { Response } from 'express';
export declare const sendResponse: <T>(res: Response, statusCode: number, data?: T | null, message?: string, error?: any) => void;
