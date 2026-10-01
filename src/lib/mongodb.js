import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGODB_URI exists:", !!MONGODB_URI);

export async function connectDB() {
  console.log("connectDB() started");

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}