import { Router } from 'express';
import serviceRouter from './service/index.js';
import bookingsRouter from './bookings/index.js';

const router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to the WedPlan API!' });
});

router.use('/service', serviceRouter)
router.use('/bookings', bookingsRouter)

export default router;