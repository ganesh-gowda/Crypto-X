import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[SUCCESS] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ERROR] MongoDB Connection Error: ${error.message}`);
    console.error('\n[WARNING] Please check:');
    console.error('1. MongoDB Atlas cluster is active (not paused)');
    console.error('2. Your IP address is whitelisted in Network Access');
    console.error('3. Connection string in .env is correct\n');
    process.exit(1);
  }
};

export default connectDB;
