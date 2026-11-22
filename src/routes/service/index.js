import { Router } from "express";
import { checkAuthenticatedUser } from "../../middleware/auth.js";
import { weddingServices } from "../../config/db.js";
import { ObjectId } from "mongodb";

const serviceRouter = Router();

serviceRouter.post("/", checkAuthenticatedUser, async (req, res) => {
  const data = req.body;
  const result = await weddingServices.insertOne(data);
  res.send(result);
});

serviceRouter.get("/", async (req, res) => {
  const quary = {};
  if (req.query) {
    if(req.query.role){
      if(req.query.role === 'vendor'){
        const filterService = await weddingServices.find({vendorId : req.query.userId}).toArray();
        if(!filterService){
          res.send([{status : 401, massage: "user unauthoraizd" }]);
          return
        }
        res.send(filterService);
        return
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

serviceRouter.get('/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const data = await weddingServices.findOne(query);
  res.send(data)
})
export default serviceRouter;
