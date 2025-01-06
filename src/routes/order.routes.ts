import { Router } from 'express';
import { authMiddleWare } from '../middlewares/auth.middleware';
import { placeOrder } from '../controllers/order.controller';

const router = Router();

router.post('/place-order', placeOrder);

export default router;
