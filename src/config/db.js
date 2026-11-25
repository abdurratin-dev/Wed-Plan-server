import { MongoClient } from "mongodb";
import { env } from "./env.js";

const uri = env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

const connectionDb = await clientPromise;
const db = connectionDb.db("WedPlan");
export const weddingServices = db.collection("WeddingServices");
export const bookings = db.collection("Bookings");
export const users = db.collection("user");
export const sessions = db.collection("session");
export const subscriptions = db.collection("subscriptions");
export const subscriptionService = db.collection("services");
export const bookingTransactions = db.collection("BookingTransactions");