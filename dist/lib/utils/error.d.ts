declare class CustomError extends Error {
    status: string;
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export default CustomError;
