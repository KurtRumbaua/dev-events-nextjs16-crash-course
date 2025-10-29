import mongoose from "mongoose";

// Define the type for our cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global namespace to include our mongoose cache
// Using 'mongooseCache' to avoid collision with the imported 'mongoose'
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Throw an error if the URI is not defined
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

// Initialize the cache on the global object to persist across hot reloads in development
// In production, this will be initialized once when the server starts
const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Caches the connection to prevent multiple connections in development (hot reload)
 * @returns Promise that resolves to the Mongoose instance
 */
async function connectToDatabase(): Promise<typeof mongoose> {
  // Type guard: ensure MONGODB_URI is defined
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
    );
  }

  // If we already have a connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no connection promise, create a new one
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Fail fast if disconnected
      serverSelectionTimeoutMS: 5000, // Fast failover on connection issues
      maxPoolSize: 10, // Reasonable pool size for development/production
    } as const;

    // Create the connection promise and store it in the cache
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log("✅ Connected to MongoDB");
      return mongoose;
    });
  }

  try {
    // Wait for the connection promise to resolve and cache the connection
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, reset the promise so we can try again
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
