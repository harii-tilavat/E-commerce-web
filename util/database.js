const mongoose = require('mongoose');

const mongoUser = process.env.MONGO_USER;
const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoCluster = process.env.MONGO_CLUSTER;
const mongoDb = process.env.MONGO_DB;
const mongoAppName = process.env.MONGO_APP_NAME;

const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/${mongoDb}?appName=${mongoAppName}`;

const connectDB = async () => {
  await mongoose.connect(uri);
};

module.exports = { connectDB, uri };
