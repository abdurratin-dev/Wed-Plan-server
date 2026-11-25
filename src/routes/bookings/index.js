import { Router } from "express";
import { chackVendorAndAdmin, checkAuthenticatedUser } from "../../middleware/auth.js";
import { bookings, bookingTransactions, users, weddingServices } from "../../config/db.js";
import { stripe } from "../../config/stripe.js";
import { ObjectId } from "mongodb";

const bookingsRouter = Router();

bookingsRouter.post("/", checkAuthenticatedUser, async (req, res) => {
  const data = req.body;
  const oldData = await bookings.findOne({
    customerId: data.customerId,
    bookingsId: data.bookingsId,
    paymentStatus: "paid",
  });
  if (oldData) {
    res.send({ success: false, massage: "You already book this service" });
    return;
  }
  const query = { _id: new ObjectId(data.bookingsId) };
  const service = await weddingServices.findOne(query);
  if (!service) {
    res.send({ mssage: "service not found" });
    return;
  }

  const result = await bookings.insertOne(data);
  const creatTransactions = await bookingTransactions.insertOne({
    bookingId : result.insertedId.toString(),
    customerEmail : data.customerEmail,
    price : data.bookingsPrice,
    status: "pending",
    paymentStatus : "unpaid"
  })
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: service.name,
            description: service.description,
          },

          unit_amount: parseInt(service.price * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/payments/success?bookingId=${creatTransactions.insertedId.toString()}`,
    cancel_url: `${process.env.CLIENT_URL}/payments/cancel`,
    mode: "payment",
    metadata: {
      bookingId: result.insertedId.toString(),
      transactionId : creatTransactions.insertedId.toString(),
      userId: data.customerId,
      mode: "payment",
    },
  });
  res.send({
    success: true,
    message: "Checkout session created",
    data: {
      redirectUrl: session.url,
    },
  });
});

bookingsRouter.get("/", checkAuthenticatedUser, async (req, res) => {
  const quary = {};
  if (req.query) {
    if (req.query.role === "vendor") {
      const userId = req.query.userId;
      if (req.query.bookingsId) {
        const bookingsid = req.query.bookingsId;
        const findService = await weddingServices.findOne({
          _id: new ObjectId(bookingsid),
        });
        if (findService.vendorId !== userId && req.query.role !== "admin") {
          res.send({ status: 401, massage: "user unauthoraizd" });
          return;
        }
      }
      const findQuery = { vendorId: userId };
      const findManyService = await weddingServices.find(findQuery).toArray();
      const serciveId = findManyService.map((data) => {
        return { id: data._id.toString() };
      });

      const bookingsData = [];
      for (let index = 0; index < serciveId.length; index++) {
        const bookingsById = await bookings
          .find({ bookingsId: serciveId[index].id })
          .toArray();
        bookingsData.push(...bookingsById);
      }
      if (bookingsData.length === 0) {
        res.send({ success : false , massage : "bookings empty"});
        return;
      }
      res.send(bookingsData);
      return;
    }
    if (req.query.role === "customer") {
      const userId = req.query.userId;
      const bookingsData = await bookings
        .find({ customerId: userId })
        .toArray();
      res.send(bookingsData);
      return;
    }
  }
  const data = await bookings.find(quary).toArray();
  res.send(data);
});

bookingsRouter.patch("/", checkAuthenticatedUser,chackVendorAndAdmin, async (req, res) => {
  const body = req.body;
  const quary = { _id: new ObjectId(body.id) };
  const update = { $set: { bookingStatus: body.bookingStatus } };
  const result = await bookings.updateOne(quary, update);
  res.send(result);
});

bookingsRouter.get('/transactions',checkAuthenticatedUser,chackVendorAndAdmin,async(req,res)=>{
  const data = await bookingTransactions.find().toArray()
  res.send(data)
})
export default bookingsRouter;
