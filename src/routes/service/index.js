import { Router } from "express";
import { checkAuthenticatedUser } from "../../middleware/auth.js";
import { weddingServices } from "../../config/db.js";

const serviceRouter = Router();

serviceRouter.post('/',checkAuthenticatedUser,async(req,res)=>{
    const data = req.body
    const result = await weddingServices.insertOne(data);
    res.send(result)
})
export default serviceRouter