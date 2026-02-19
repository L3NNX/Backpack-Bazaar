
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined!");
    }

    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully");
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e.message);
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;