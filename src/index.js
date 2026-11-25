import app from './app.js';
import { closeDB, connectDB } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

// Close the database connection when the process is stopped (Ctrl+C or restart).
async function shutdown() {
  await closeDB();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();