import { MongoClient } from "mongodb";
import { env } from "./env.js";

const options = {
  maxPoolSize: 10, 
  minPoolSize: 5, 
};

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(env.MONGODB_URI, options);
  await client.connect();

  const db = client.db("WedPlan");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

const { db } = await connectToDatabase();
export const weddingServices = db.collection("WeddingServices");
export const  bookings = db.collection("Bookings");
export const  users = db.collection("user");
export const  sessions = db.collection("session");
export const  subscriptions = db.collection("subscriptions");
export const  subscriptionService = db.collection("services");
export const  bookingTransactions = db.collection("BookingTransactions");

