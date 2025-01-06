import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomError from '../../lib/utils/error';
import crypto from 'crypto';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  if (salt) {
    return bcrypt.hash(password, salt);
  }
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

// CREATE JWT TOKEN
type JWTUSER = {
  userId: string;
  role?: string;
};

type optionsType = { expiresIn: string | number };

export const createJWT = (user: JWTUSER, options: optionsType) => {
  return jwt.sign(
    { userId: user.userId, role: user.role },
    process.env.JWT_SECRET,
    options
  );
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded as JWTUSER;
  } catch (error) {
    throw new CustomError('invalid token', 403);
  }
};

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashAPIKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

export const generateTrackingId = (length = 12) => {
  const digits = '0123456789';
  let trackingId = '';
  for (let i = 0; i < length; i++) {
    trackingId += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return trackingId;
};
