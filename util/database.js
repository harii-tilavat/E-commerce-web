const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const config = {
  username: 'admin',
  password: encodeURIComponent('admin@123'),
};
const uri = `mongodb+srv://${config.username}:${config.password}@cluster0.nnjei7r.mongodb.net/e_commerce?appName=Cluster0`;

const connectMongoDB = async () => {
  try {
    const client = await mongoose.connect(uri);
    return client;
  } catch (error) {
    console.log('DB Error ==>>', error);
    throw error;
  }
};

const sequelize = new Sequelize('e_commerce', 'root', 'admin@123', {
  host: 'localhost',
  dialect: 'mysql',
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
