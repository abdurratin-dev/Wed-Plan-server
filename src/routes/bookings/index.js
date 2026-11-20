import { Router } from "express";
import { checkAuthenticatedUser } from "../../middleware/auth.js";
import { bookings } from "../../config/db.js";

const bookingsRouter = Router()

bookingsRouter.post('/',checkAuthenticatedUser,async(req,res)=>{
    const data  = req.body;
    const result = await bookings.insertOne(data);
    res.send(result);
})

bookingsRouter.get('/',checkAuthenticatedUser,async(req,res)=>{
    const quary = {}
    if(req.query){
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
export default bookingsRouter