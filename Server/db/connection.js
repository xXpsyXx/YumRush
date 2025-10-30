import mongoose from "mongoose";

// Cache the connect() promise so repeated imports / cold starts reuse it.
let cachedPromise = null;

export function isConnected() {
  return mongoose.connection && mongoose.connection.readyState >= 1;
}

export async function connectMongo() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGODBURI ||
    process.env.MONGO_URI ||
    process.env.MONGOURL ||
    "";
  const dbName = process.env.DB || process.env.DB_NAME;

  if (!uri) {
    console.warn(
      "Mongo URI env not set (MONGODB_URI/MONGODBURI/MONGO_URI). Skipping connection."
    );
    return null;
  }

  // If mongoose is already connected, return the connection immediately.
  if (isConnected()) {
    console.log("MongoDB: already connected");
    return mongoose.connection;
  }

  // If a connection attempt is already in-flight, reuse its promise.
  if (cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = mongoose
    .connect(uri, { dbName: dbName || undefined })
    .then(() => {
      console.log("MongoDB connected");
      return mongoose.connection;
    })
    .catch((err) => {
      console.error(
        "MongoDB connection error:",
        err && err.message ? err.message : err
      );
      // Reset cachedPromise so future attempts can retry.
      cachedPromise = null;
      // Do not throw to avoid breaking serverless startup; caller can decide.
      return null;
    });

  return cachedPromise;
}

export default mongoose;
