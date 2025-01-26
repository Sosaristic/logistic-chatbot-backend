import express from 'express';

import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import { authRoutes, orderRoutes } from './routes';
import sendEmail from './services/send_email';
import errorController from './controllers/error.controller';
import CustomError from './lib/utils/error';
import { authMiddleWare } from './middlewares/auth.middleware';

dotenv.config();

const app = express();

const corsOptions: CorsOptions = {
  credentials: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'https://cozycart.netlify.app',
    'https://dashboard-chatbot-tau.vercel.app',
    process.env.CLIENT_URL,
  ],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(
  compression({
    level: 6,
    threshold: 10 * 1000,
  })
);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/order', orderRoutes);
app.get('/protected', authMiddleWare, (req, res) => {
  res.status(200).json({ message: "You're logged in!" });
});

app.all('*', (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(errorController);

export default app;
