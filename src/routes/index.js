import { Router } from 'express';
import { weddingServices } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to the WedPlan API!' });
});

router.get('/data',async (req, res)=>{
    const data = await weddingServices.find().toArray();
    res.send(data);
})

export default router;