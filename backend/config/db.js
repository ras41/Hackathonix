import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI (or MONGODB_URI) is not set");
  }

  mongoose.set("bufferCommands", false);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;

  } catch (error) {

    console.error("MongoDB connection error:", error.message);
    throw error;

  }
};

export default connectDB;
