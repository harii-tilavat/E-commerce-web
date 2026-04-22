const mongoose = require('mongoose');

const config = {
  username: 'admin',
  password: encodeURIComponent('admin@123'),
};
const uri = `mongodb+srv://${config.username}:${config.password}@cluster0.nnjei7r.mongodb.net/shop?appName=Cluster0`;

const connectDB = async () => {
  try {
    const client = await mongoose.connect(uri);
    return client;
  } catch (error) {
    console.log('DB Error ==>>', error);
  }
};

module.exports = { connectDB };
