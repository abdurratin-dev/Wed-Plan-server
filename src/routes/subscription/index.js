import { Router } from "express";
import { subscriptions, subscriptionService } from "../../config/db.js";
import { stripe } from "../../config/stripe.js";
import { checkAuthenticatedUser } from "../../middleware/auth.js";
import { ObjectId } from "mongodb";

const subscriptionRouter = Router();

subscriptionRouter.get(
  "/service",
  checkAuthenticatedUser,
  async (req, res) => {
    const data = await subscriptionService.find().toArray();
    res.send(data);
  },
);

subscriptionRouter.post(
  "/create-checkout-session",
  checkAuthenticatedUser,
  async (req, res) => {
    const payload = req.body;
    const service = await subscriptionService.findOne({
      _id: new ObjectId(payload.serviceID),
    });
    if (!service) {
      res.send({ mssage: "service not found" });
      return;
    }
    const subscriptionCollection = {
      serviceID: payload.serviceID,
      email: payload.email,
      status: 'pending',
      subscriptionStatus: "unsubscribe",
      subscriptionAt: new Date().toISOString(),
    };

    const createSubscriptionResult = await subscriptions.insertOne(
      subscriptionCollection,
    );
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            recurring: {
              interval: "month",
            },
            product_data: {
              name: service.name,
              description: service.description,
            },

            unit_amount: parseInt(service.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/vendor/subscription/success?bookingId=${createSubscriptionResult.insertedId.toString()}`,
      cancel_url: `${process.env.CLIENT_URL}/vendor/subscription/cancel`,
      mode: "subscription",
      metadata: {
        bookingId: createSubscriptionResult.insertedId.toString(),
        userId: payload.userId,
        mode : "subscription"
      },
    });
    res.send({
      success: true,
      message: "Checkout session created",
      data: {
        redirectUrl: session.url,
      },
    });
  },
);

export default subscriptionRouter;
