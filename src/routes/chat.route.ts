import { Router } from 'express';
import { handleChats } from '../controllers/chat.controller';

const router = Router();

router.post('/conversation', handleChats);

export default router;
