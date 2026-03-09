import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const mongoDbName = process.env.MONGO_DB_NAME || "hackathonix";

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  mongoose.set("bufferCommands", false);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      dbName: mongoDbName
    });

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;

  } catch (error) {

    console.error("MongoDB connection error:", error.message);
    throw error;

  }
};

export default connectDB;
