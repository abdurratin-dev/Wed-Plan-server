import { MongoClient } from "mongodb";
import { env } from "./env.js";

const options = {
  maxPoolSize: 10, 
  minPoolSize: 5, 
};

let client;
let clientPromise;

// Vercel এর জন্য Global Cache প্যাটার্ন
if (!global._mongoClientPromise) {
  client = new MongoClient(env.MONGODB_URI, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// Database এবং Collection পাওয়ার ফাংশন
export async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db
}

export let weddingServices;
export let bookings;
export let users;
export let sessions;
export let subscriptions;
export let subscriptionService;
export let bookingTransactions;

async function initCollections() {
  const { db } = await getCollection();
  weddingServices = db.collection("WeddingServices");
  bookings = db.collection("Bookings");
  users = db.collection("user");
  sessions = db.collection("session");
  subscriptions = db.collection("subscriptions");
  subscriptionService = db.collection("services");
  bookingTransactions = db.collection("BookingTransactions");
}

initCollections().catch(console.error);
