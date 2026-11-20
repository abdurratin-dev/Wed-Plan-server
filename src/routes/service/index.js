import { Router } from "express";
import { checkAuthenticatedUser } from "../../middleware/auth.js";
import { weddingServices } from "../../config/db.js";

const serviceRouter = Router();

serviceRouter.post("/", checkAuthenticatedUser, async (req, res) => {
  const data = req.body;
  const result = await weddingServices.insertOne(data);
  res.send(result);
});

serviceRouter.get("/", async (req, res) => {
  const quary = {};
  if (req.query) {
    if (req.query.category) {
      quary.category = req.query.category;
    }
    if (req.query.location) {
      quary.location = req.query.location;
    }
    if (req.query.search) {
      quary.name = { $regex: req.query.search, $options: "i" };
    }
  }
  const data = weddingServices.find(quary);
  const result = await data.toArray();
  res.send(result);
});
export default serviceRouter;
