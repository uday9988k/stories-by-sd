const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  // Already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Connection is currently being established
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_CONN, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

module.exports = connectDB;
