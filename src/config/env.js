import "dotenv/config";

// Central place for environment variables.
// Other files import `env` from here instead of reading process.env directly.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing required environment variable: MONGODB_URI. Copy .env.example to .env and fill in your MongoDB connection string."
  );
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI,
  // Frontend origin allowed by CORS.
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};