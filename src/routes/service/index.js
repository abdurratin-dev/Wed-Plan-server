import { Router } from "express";
import { chackVendorAndAdmin, checkAuthenticatedUser } from "../../middleware/auth.js";
import { weddingServices } from "../../config/db.js";
import { ObjectId } from "mongodb";

const serviceRouter = Router();

serviceRouter.post("/", checkAuthenticatedUser,chackVendorAndAdmin, async (req, res) => {
  const data = req.body;
  const result = await weddingServices.insertOne(data);
  res.send(result);
});

serviceRouter.get("/", async (req, res) => {
  const quary = {};
  if (req.query) {
    if (req.query.role) {
      if (req.query.role === "vendor") {
        const filterService = await weddingServices
          .find({ vendorId: req.query.userId })
          .toArray();
        if (!filterService) {
          res.send([{ status: 401, massage: "user unauthoraizd" }]);
          return;
        }
        res.send(filterService);
        return;
      }
    }
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

serviceRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const data = await weddingServices.findOne(query);
  res.send(data);
});

serviceRouter.patch("/",checkAuthenticatedUser,chackVendorAndAdmin, async (req, res) => {
  const body = req.body;
  const query = { _id: new ObjectId(body.id) };
  const updateDocument = {
    $set: {
      name: body.name,
      category : body.category,
      description: body.description,
      price: body.price,
      location : body.location,
      imageUrl : body.imageUrl,
      status : body.status,},
  };
  const rsult = await weddingServices.updateOne(query,updateDocument)
  res.send(rsult)
});

serviceRouter.delete('/',chackVendorAndAdmin,checkAuthenticatedUser,async(req,res)=>{
  const data = req.query
  console.log(data);
  const query = {_id : new ObjectId(data.id)}
  const result = await weddingServices.deleteOne(query)
  res.send(result)
})
export default serviceRouter;
