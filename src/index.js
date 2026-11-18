import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { MongoClient } from 'mongodb'
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const db = client.db('WedPlan');
export const weddingServices = db.collection('WeddingServices');
export const bookings = db.collection('Bookings');
export const users = db.collection('');


app.get('/', (req, res) => {
  res.send({message: 'WedPlan Server is running!'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;