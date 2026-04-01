import { Router, Response } from 'express';
import { ExpenseService } from '../services/ExpenseService.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/expenses - Create new expense
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { description, value, date, category, type, resident_ids } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const expense = await ExpenseService.createExpense({
      user_id: userId,
      description,
      value,
      date,
      category,
      type,
      resident_ids,
    });

    return res.status(201).json(expense);
  } catch (error: any) {
    console.error('Create expense error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/expenses - Get all expenses by user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const expenses = await ExpenseService.getExpensesByUser(userId, limit, offset);

    return res.status(200).json(expenses);
  } catch (error: any) {
    console.error('Get expenses error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/expenses/:id - Get expense by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const expenseId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const expense = await ExpenseService.getExpenseById(expenseId, userId);

    return res.status(200).json(expense);
  } catch (error: any) {
    console.error('Get expense error:', error.message);
    res.status(404).json({ error: error.message });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const expenseId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { description, value, date, category, type } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const expense = await ExpenseService.updateExpense(expenseId, userId, {
      description,
      value,
      date,
      category,
      type,
    });

    return res.status(200).json(expense);
  } catch (error: any) {
    console.error('Update expense error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const expenseId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await ExpenseService.deleteExpense(expenseId, userId);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Delete expense error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;
