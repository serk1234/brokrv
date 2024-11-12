const mongoose = require('mongoose');

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    console.log("Connecting to database with URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false       // Disable command buffering for production
    });
    console.log("Connected to MongoDB via Mongoose");
  } catch (error) {
    console.error("Database connection failed with error code:", error.code);
    console.error("Error details:", error.message);
    throw new Error("Database connection failed");
  }
};

module.exports = dbConnect;
