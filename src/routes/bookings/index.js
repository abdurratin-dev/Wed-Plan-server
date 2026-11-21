import { Router } from "express";
import { checkAuthenticatedUser } from "../../middleware/auth.js";
import { bookings, users } from "../../config/db.js";
import { ObjectId } from "mongodb";

const bookingsRouter = Router()

bookingsRouter.post('/',checkAuthenticatedUser,async(req,res)=>{
    const data  = req.body;
    const oldData = await bookings.findOne({customerId : data.customerId , bookingsId : data.bookingsId})
    if(oldData){
        res.send({success : false , massage : 'You already book this service'});
        return
    }
    const result = await bookings.insertOne(data);
    res.send(result);
})

bookingsRouter.get('/',checkAuthenticatedUser,async(req,res)=>{
    const quary = {}
    if(req.query){
        if(req.query.role === 'vendor' || req.query.role === 'admin'){
            const id = req.query.id
            const user = await users.findOne({_id : new ObjectId(id)});
            if(user || req.query.role === 'admin'){
                console.log(user);
            }
        }
        if(req.query.status){
            quary.bookingStatus = req.query.status
        }
        if(req.query.search){
            quary.$or = [
                {bookingTitle : {$regex : req.query.search, $options : 'i'}},
                {bookingsCategory : {$regex : req.query.search, $options : 'i'}},
                {bookingsLocation:{$regex : req.query.search, $options : 'i'}}
            ]
        }
    }
    const data = await bookings.find(quary).toArray();
    res.send(data)
})

bookingsRouter.patch('/',checkAuthenticatedUser,async(req,res)=>{
    const body = req.body
    const quary = {_id : new ObjectId(body.id)}
    const update = {$set : {bookingStatus : body.bookingStatus}}
    const result = await bookings.updateOne(quary,update)
    res.send(result)
})
export default bookingsRouter