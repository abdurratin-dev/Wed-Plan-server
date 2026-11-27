import { MongoClient } from "mongodb";
import { env } from "./env.js";

let client;
let clientPromise;

// Vercel এর জন্য Global Cache প্যাটার্ন
if (!global._mongoClientPromise) {
  client = new MongoClient(env.MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// Database এবং Collection পাওয়ার ফাংশন
export async function getCollection() {
  const client = await clientPromise;
  const db = client.db("WedPlan");
  return db
}

const db = await getCollection();
export const weddingServices = db.collection("WeddingServices");
export const bookings = db.collection("Bookings");
export const users = db.collection("user");
export const sessions = db.collection("session");
export const subscriptions = db.collection("subscriptions");
export const subscriptionService = db.collection("services");
export const bookingTransactions = db.collection("BookingTransactions");

