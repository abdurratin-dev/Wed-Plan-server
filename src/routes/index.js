import { Router } from 'express';
import serviceRouter from './service/index.js';
import { sessions } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to the WedPlan API!' });
});

router.use('/service', serviceRouter)
const token = "0JSDPj830cyZE7EzW9MqEAms8yWBNk3b"
router.get("/get" , async(req,res)=>{
    const sesson = await sessions.findOne({token})
    res.send(sesson)
})

export default router;