const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_system';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected:', uri);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Is MongoDB running? Start it locally, or set MONGODB_URI to an Atlas connection string in .env');
    process.exit(1);
  }
}

module.exports = connectDB;
