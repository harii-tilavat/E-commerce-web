import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';

import { connectDB } from './config/database.js';
import errorHandler from './middlewares/error-handler.js';
import ApiError from './utils/api-error.js';
import { StatusCode } from './utils/api-response.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', shopRoutes);

app.use((req, res, next) => next(new ApiError(StatusCode.NOT_FOUND, `Route not found: ${req.originalUrl}`)));
app.use(errorHandler);

connectDB()
  .then(() => {
    console.log('Mongodb connected successfully! 🟢');
    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT} 🟢`);
    });
  })
  .catch((err) => {
    console.log('DB connect failed:', err);
    process.exit(1);
  });
