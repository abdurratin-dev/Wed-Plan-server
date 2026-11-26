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

  const db = client.db("wed-plan");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export let weddingServices;
export let bookings;
export let users;
export let sessions;
export let subscriptions;
export let subscriptionService;
export let bookingTransactions;

async function initCollections() {
  const { db } = await connectToDatabase();
  weddingServices = db.collection("WeddingServices");
  bookings = db.collection("Bookings");
  users = db.collection("user");
  sessions = db.collection("session");
  subscriptions = db.collection("subscriptions");
  subscriptionService = db.collection("services");
  bookingTransactions = db.collection("BookingTransactions");
}

initCollections().catch(console.error);
