import { Router } from 'express';
import { placeOrder } from '../controllers/order.controller';

const router = Router();

router.post('/place-order', placeOrder);

export default router;
