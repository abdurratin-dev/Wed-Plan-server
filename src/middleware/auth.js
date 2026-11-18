import { sessions, users } from "../config/db.js";

export const checkAuthenticatedUser = async(req,res,next) =>{
    const hedars = req.headers.authorization;
    if(!hedars){
        res.status(401).send({massage : 'User Unauthorizatied'})
        return
    }
    const token = hedars.split(' ')[1];
    if(!token){
        res.status(401).send({massage : 'User Unauthorizatied'})
        return
    }
    const session = await sessions.findOne({token});
    const user = await users.findOne({_id : session.userId})
    if(!user){
        res.status(401).send({massage : 'User Unauthorizatied'})
        return
    }
    next();
}