import express from 'express';
import { getBudgetByEvent, setOrUpdateBudget, addExpense } from '../controllers/budgetControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:eventId', verifyToken, getBudgetByEvent);
router.post('/set', verifyToken, setOrUpdateBudget);
router.post('/expense', verifyToken, addExpense);

export default router;
