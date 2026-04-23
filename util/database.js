const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const mongoUser = process.env.MONGO_USER;
const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoCluster = process.env.MONGO_CLUSTER;
const mongoDb = process.env.MONGO_DB;
const mongoAppName = process.env.MONGO_APP_NAME;

const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/${mongoDb}?appName=${mongoAppName}`;

const connectMongoDB = async () => {
  try {
    const client = await mongoose.connect(uri);
    return client;
  } catch (error) {
    console.log('DB Error ==>>', error);
    throw error;
  }
};

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_DIALECT,
});

const connectDB = async () => {
  try {
    await connectMongoDB();
    console.log('MongoDB connected successfully! 🟢');
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    console.log('MySQL connected successfully! 🟢');
  } catch (error) {
    console.log('DB Error ==>>', error);
  }
};

module.exports = { connectDB, sequelize };
