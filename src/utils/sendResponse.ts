import { Response } from 'express';

interface ResponseFormat<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  error: any | null;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T | null = null,
  message: string = '',
  error: any = null
): void => {
  const response: ResponseFormat<T> = {
    status: error ? 'error' : 'success',
    message:
      message || (error ? 'An error occurred' : 'Request was successful'),
    data,
    error,
  };

  res.status(statusCode).json(response);
};
