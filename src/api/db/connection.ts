import mongoose from "mongoose";

// Type-safe connection state
interface ConnectionState {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Extend global type for mongoose caching
declare global {
  var mongoose: ConnectionState | undefined;
}

// Cache connection to prevent multiple instances in Next.js dev mode
let cached: ConnectionState = global.mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Validate environment variables
function validateEnvVars(): { uri: string; dbName: string } {
  const uri = process.env.MONGO_DB_URI;
  const dbName = process.env.MONGO_DB_NAME;

  if (!uri) {
    throw new Error("MONGO_DB_URI environment variable is not defined");
  }

  if (!dbName) {
    throw new Error("MONGO_DB_NAME environment variable is not defined");
  }

  return { uri, dbName };
}

// Connection options optimized for production
const connectionOptions: mongoose.ConnectOptions = {
  appName: "Next.js App",
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10, // Connection pool size
  minPoolSize: 2,
  maxIdleTimeMS: 10000,
  retryWrites: true,
  retryReads: true,
  // Optimize for serverless/Next.js
  bufferCommands: false, // Disable mongoose buffering
};

// Setup connection event listeners
function setupConnectionListeners(connection: mongoose.Connection): void {
  connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully");
  });

  connection.on("error", (error) => {
    console.error("❌ MongoDB connection error:", error);
  });

  connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
  });

  // Only set debug in development
  if (process.env.NODE_ENV === "development") {
    connection.set("debug", true);
  }
}

// Graceful shutdown handler
function setupGracefulShutdown(connection: mongoose.Connection): void {
  const shutdown = async (signal: string) => {
    try {
      await connection.close();
      console.log(`MongoDB connection closed due to ${signal}`);
      process.exit(0);
    } catch (error) {
      console.error("Error during MongoDB shutdown:", error);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

export async function getDBConnection(): Promise<mongoose.Connection> {
  // Return cached connection if already established
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  // Return in-progress connection promise if exists
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  try {
    const { uri, dbName } = validateEnvVars();

    // Create connection promise
    cached.promise = mongoose
      .createConnection(uri, {
        ...connectionOptions,
        dbName,
      })
      .asPromise();

    cached.conn = await cached.promise;

    // Setup event listeners
    setupConnectionListeners(cached.conn);

    // Setup graceful shutdown (only once)
    if (process.env.NODE_ENV === "production") {
      setupGracefulShutdown(cached.conn);
    }

    return cached.conn;
  } catch (error) {
    // Clear promise on error to allow retry
    cached.promise = null;
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function connectToDb(): Promise<void> {
  const connection = await getDBConnection();

  // Wait for connection to be ready
  if (connection.readyState === 1) {
    return;
  }

  if (connection.readyState === 2) {
    // Connecting state - wait for it
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout waiting for database"));
      }, 10000); // 10 second timeout

      connection.once("connected", () => {
        clearTimeout(timeout);
        resolve();
      });

      connection.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    return;
  }

  throw new Error(
    `Connection to Auth DB is not ready. State: ${connection.readyState}`
  );
}

// Optional: Health check function
export async function checkDbHealth(): Promise<boolean> {
  try {
    const connection = await getDBConnection();
    return connection.readyState === 1;
  } catch {
    return false;
  }
}

// Optional: Disconnect function for testing
export async function disconnectDb(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
  }
}
