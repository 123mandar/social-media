import mongoose from 'mongoose';

const FALLBACK_MONGO_URI = 'mongodb://127.0.0.1:27017/property_deal_tracker';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || FALLBACK_MONGO_URI;

  if (!process.env.MONGO_URI) {
    console.warn(
      `⚠️ MONGO_URI is not set. Falling back to local MongoDB URI: ${FALLBACK_MONGO_URI}`
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error(
      'ℹ️ Add MONGO_URI to server/.env (you can copy server/.env.example to server/.env).'
    );
    process.exit(1);
  }
};

export default connectDB;
