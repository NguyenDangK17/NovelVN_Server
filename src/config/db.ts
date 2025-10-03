import mongoose from "mongoose";

let isConnecting = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  // Reuse existing connection in serverless
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (isConnecting) {
    // If a connect attempt is already in-flight, wait briefly
    await new Promise((resolve) => setTimeout(resolve, 50));
    return;
  }

  try {
    isConnecting = true;
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    // In serverless, do not exit the process; rethrow to surface 500
    throw error;
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
