import mongoose from 'mongoose';

const FALLBACK_MONGO_URI = 'mongodb://127.0.0.1:27017/property_deal_tracker';

const resolveMongoUri = () => {
  const rawValue = process.env.MONGO_URI;

  if (typeof rawValue === 'string') {
    const normalized = rawValue.trim();

    if (normalized && normalized.toLowerCase() !== 'undefined' && normalized.toLowerCase() !== 'null') {
      return normalized;
    }
  }

  console.warn(
    `⚠️ MONGO_URI is missing/invalid. Falling back to local MongoDB URI: ${FALLBACK_MONGO_URI}`
  );

  return FALLBACK_MONGO_URI;
};

const connectDB = async () => {
  const mongoUri = resolveMongoUri();

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error(
      'ℹ️ Ensure MongoDB is running and set a valid MONGO_URI in server/.env (copy from server/.env.example).'
    );
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
