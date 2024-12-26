class CustomError extends Error {
  status: string;
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.status =
      this.statusCode >= 400 && this.statusCode < 500 ? 'error' : 'fail';
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export default CustomError;
