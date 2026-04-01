import { Router, Response } from 'express';
import { IncomeService } from '../services/IncomeService.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/incomes - Create new income
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { description, value, date, category, resident_id } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const income = await IncomeService.createIncome({
      user_id: userId,
      description,
      value,
      date,
      category,
      resident_id,
    });

    return res.status(201).json(income);
  } catch (error: any) {
    console.error('Create income error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/incomes - Get all incomes by user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const incomes = await IncomeService.getIncomesByUser(userId, limit, offset);

    return res.status(200).json(incomes);
  } catch (error: any) {
    console.error('Get incomes error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/incomes/:id - Get income by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const incomeId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const income = await IncomeService.getIncomeById(incomeId, userId);

    return res.status(200).json(income);
  } catch (error: any) {
    console.error('Get income error:', error.message);
    res.status(404).json({ error: error.message });
  }
});

// PUT /api/incomes/:id - Update income
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const incomeId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { description, value, date, category, resident_id } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const income = await IncomeService.updateIncome(incomeId, userId, {
      description,
      value,
      date,
      category,
      resident_id,
    });

    return res.status(200).json(income);
  } catch (error: any) {
    console.error('Update income error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/incomes/:id - Delete income
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const incomeId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await IncomeService.deleteIncome(incomeId, userId);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Delete income error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;
