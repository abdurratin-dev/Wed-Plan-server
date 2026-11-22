import { MongoClient } from "mongodb";
import { env } from "./env.js";

const client = new MongoClient(env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const clientConnectionPromise = await connectToMongoDB();
const db = client.db('WedPlan');
export const weddingServices = db.collection('WeddingServices');
export const bookings = db.collection('Bookings');
export const users = db.collection('user');
export const sessions = db.collection('session');
export const subscriptions = db.collection('subscriptions')
export const subscriptionService = db.collection('services')