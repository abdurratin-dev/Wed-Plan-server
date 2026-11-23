import { Router } from 'express';
import serviceRouter from './service/index.js';
import bookingsRouter from './bookings/index.js';
import subscriptionRouter from './subscription/index.js';
import usersRouter from './users/index.js';

const router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to the WedPlan API!' });
});

router.use('/service', serviceRouter)
router.use('/bookings', bookingsRouter)
router.use('/subscription',subscriptionRouter)
router.use('/users',usersRouter)

export default router;