export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
type JWTUSER = {
    userId: string;
    role?: string;
};
type optionsType = {
    expiresIn: string | number;
};
export declare const createJWT: (user: JWTUSER, options: optionsType) => any;
export declare const verifyJWT: (token: string) => JWTUSER;
export declare const generateRandomString: (length: number) => string;
export declare const hashAPIKey: (apiKey: string) => string;
export declare const generateTrackingId: (length?: number) => string;
export {};
