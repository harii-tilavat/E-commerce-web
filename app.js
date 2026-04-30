require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');

const { connectDB } = require('./util/database');
const errorHandler = require('./middlewares/error-handler');
const ApiError = require('./utils/api-error');
const { StatusCode } = require('./utils/api-response');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const socketService = require('./services/socket.service');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

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
    server.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT} 🟢`);
      socketService.init(server);
    });
  })
  .catch((err) => {
    console.log('DB connect failed:', err);
    process.exit(1);
  });
