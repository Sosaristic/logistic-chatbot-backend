import { Router } from 'express';
import { placeOrder, trackOrder } from '../controllers/order.controller';

const router = Router();

router.post('/place-order', placeOrder);
router.get('/track-order/:tracking_id', trackOrder);

export default router;
