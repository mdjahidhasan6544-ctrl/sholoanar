const mongoose = require("mongoose");

let cachedConnection = global.mongooseConnection;

if (!cachedConnection) {
  cachedConnection = global.mongooseConnection = {
    conn: null,
    promise: null
  };
}

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  mongoose.set("strictQuery", true);

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(process.env.MONGODB_URI).then((mongooseInstance) => mongooseInstance);
  }

  cachedConnection.conn = await cachedConnection.promise;
  console.log("MongoDB connected");
  return cachedConnection.conn;
}

module.exports = connectDatabase;
