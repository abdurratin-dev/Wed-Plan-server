import { MongoClient } from "mongodb";
import { env } from "./env.js";

export const DB_NAME = "WedPlan";

const client = new MongoClient(env.DB_URI);
let db = client.db(DB_NAME);

export async function connectDB() {
  await client.connect();
  db = client.db(DB_NAME);
  await db.command({ ping: 1 });
  return db;
}

export const weddingServices = db.collection('WeddingServices');
export const bookings = db.collection('Bookings');
export const users = db.collection('user');
export const sessions = db.collection('session');
export const subscriptions = db.collection('subscriptions')
export const subscriptionService = db.collection('services')
export const bookingTransactions = db.collection("BookingTransactions")

export async function closeDB() {
  await client.close();
}