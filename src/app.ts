import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';

import { authRoutes, chatRoutes, dashboardRoutes, orderRoutes } from './routes';
import errorController from './controllers/error.controller';
import CustomError from './lib/utils/error';
import { authMiddleWare } from './middlewares/auth.middleware';
import { handleChats } from './utils/chatHandler';

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Fix: Apply CORS directly to Socket.IO
export const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5173',
      'https://cozycart.netlify.app',
      'https://dashboard-chatbot-tau.vercel.app',
      process.env.CLIENT_URL,
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const corsOptions = {
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

handleChats(io);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

// ✅ Test route for Socket.IO
app.get('/socket.io', (req, res) => {
  res.status(200).json({ message: 'Socket.io is running' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.get('/api/v1/protected', authMiddleWare, (req, res) => {
  res.status(200).json({ message: "You're logged in!" });
});

// Handle 404 errors
app.all('*', (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(errorController);

export default server;
