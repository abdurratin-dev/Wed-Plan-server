import { Router } from "express";
import { chackAdmin, checkAuthenticatedUser } from "../../middleware/auth.js";
import { users } from "../../config/db.js";
import { ObjectId } from "mongodb";

const usersRouter = Router()

usersRouter.get('/',checkAuthenticatedUser,chackAdmin,async(req,res)=>{
    const data = await users.find().toArray()
    res.send(data)
})

usersRouter.patch('/',checkAuthenticatedUser,chackAdmin,async(req,res)=>{
    const data = req.body
    const query = {_id : new ObjectId(data.id)}
    const updateDqument = {$set : {
        status : data.status
    }}
    const result = await users.updateOne(query,updateDqument)
    res.send(result)
})

usersRouter.patch('/:id',checkAuthenticatedUser,async(req,res)=>{
    const id = req.params.id
    const data = req.body
    const query = {_id : new ObjectId(id)}
    const updateDocument = {
        $set:{
            name: data.name,
            image : data.image
        }
    }
    const result = await users.updateOne(query,updateDocument)
    res.send(result)
})
export default usersRouter