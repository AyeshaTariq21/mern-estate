import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import './firebase.js';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CREATE APP FIRST
const app = express();

// ✅ CORS MUST COME AFTER app
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-estate-sage-sigma.vercel.app",
    ],
    credentials: true,
  })
);

// middlewares
app.use(express.json());
app.use(cookieParser());
res.cookie("access_token", token, {
  httpOnly: true,
  secure: true,        // REQUIRED on https
  sameSite: "none",    // REQUIRED for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// db
mongoose.connect(process.env.MONGO)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('Mongo error:', err));

// server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;
