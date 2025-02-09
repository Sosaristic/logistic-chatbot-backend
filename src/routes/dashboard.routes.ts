import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboard';
import { authMiddleWare } from '../middlewares/auth.middleware';
import { adminMiddleWare } from '../middlewares/admin.middleware';

const router = Router();

router.use(authMiddleWare, adminMiddleWare);
router.get('/overview', getDashboardOverview);

export default router;
