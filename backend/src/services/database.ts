import mongoose from "mongoose";

let connectionPromise: Promise<boolean> | undefined;
let missingUriWarningLogged = false;

export function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    if (!missingUriWarningLogged) {
      console.warn(
        "MONGODB_URI is not configured; authentication endpoints are unavailable.",
      );
      missingUriWarningLogged = true;
    }
    return Promise.resolve(false);
  }

  if (mongoose.connection.readyState === 1) return Promise.resolve(true);

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        console.info("Connected to MongoDB.");
        return true;
      })
      .catch((error: unknown) => {
        console.error("Could not connect to MongoDB:", error);
        connectionPromise = undefined;
        return false;
      });
  }
  return connectionPromise;
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
