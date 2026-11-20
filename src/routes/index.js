import { Router } from 'express';
import serviceRouter from './service/index.js';

const router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to the WedPlan API!' });
});

router.use('/service', serviceRouter)

export default router;