import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {
  bookings,
  bookingTransactions,
  subscriptions,
  users,
} from "./config/db.js";
import { stripe } from "./config/stripe.js";
import { ObjectId } from "mongodb";
import "dotenv/config";
import { env } from "./config/env.js";

const app = express();

app.post(
  "/api/webhooks/stripe",
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let rawBody;

    try {
      if (Buffer.isBuffer(req.body)) {
        rawBody = req.body;
      } else {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        rawBody = Buffer.concat(chunks).toString("utf8");
      }
    } catch (err) {
      console.error("Failed to get raw body:", err);
      return res.status(400).send("Failed to read request body");
    }

    // step-2: Verify the signature so only genuine Stripe events are accepted.
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (e) {
      console.log("Stripe webhook verification failed:", e.message);
      return res.status(400).send(`Webhook Error: ${e.message}`);
    }

    // step-3: Handle the event types we care about.
    console.log("Stripe event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // bookingId was attached as metadata in POST /bookings/create-checkout-session.
      console.log(
        "Payment completed for booking:",
        session.metadata?.bookingId,
      );
      // Update the booking status in the database.
      if (session.metadata?.mode === "payment") {
        await bookings.updateOne(
          { _id: new ObjectId(session.metadata?.bookingId) },
          { $set: { bookingStatus: "Confirmed", paymentStatus: "paid" } },
        );
        await bookingTransactions.updateOne(
          { _id: new ObjectId(session.metadata.transactionId) },
          { $set: { status: "success", paymentStatus: "paid" } },
        );
      }
      if (session.metadata?.mode === "subscription") {
        await subscriptions.updateOne(
          { _id: new ObjectId(session.metadata?.bookingId) },
          { $set: { status: "confirmed", subscriptionStatus: "subscribed" } },
        );
        const res = await users.updateOne(
          { _id: new ObjectId(session.metadata?.userId) },
          { $set: { premium: true } },
        );
      }
    }

    console.log("Webhook API Triggered");

    console.log("Signature:", !!signature);

    console.log("Raw Body:", Buffer.isBuffer(req.body));
    // step-4: Acknowledge receipt. Without a response Stripe times out and retries.
    res.json({ received: true });
  },
);

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.use("/", router);

app.use(notFound);
app.use(errorHandler);

export default app;
