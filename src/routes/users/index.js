import { Router } from "express";
import { checkAuthenticatedUser } from "../../middleware/auth.js";
import { users } from "../../config/db.js";
import { ObjectId } from "mongodb";

const usersRouter = Router()

usersRouter.get('/',checkAuthenticatedUser,async(req,res)=>{
    const data = await users.find().toArray()
    res.send(data)
})

usersRouter.patch('/',checkAuthenticatedUser,async(req,res)=>{
    const data = req.body
    const query = {_id : new ObjectId(data.id)}
    const updateDqument = {$set : {
        status : data.status
    }}
    const result = await users.updateOne(query,updateDqument)
    res.send(result)
})
export default usersRouter