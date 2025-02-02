import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboard';
import { authMiddleWare } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleWare);
router.get('/overview', getDashboardOverview);

export default router;
