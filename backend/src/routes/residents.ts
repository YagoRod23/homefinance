import { Router, Response } from 'express';
import { ResidentService } from '../services/ResidentService.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/residents - Create new resident
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const resident = await ResidentService.createResident({
      user_id: userId,
      name,
      email,
    });

    return res.status(201).json(resident);
  } catch (error: any) {
    console.error('Create resident error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/residents - Get all residents by user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const residents = await ResidentService.getResidentsByUser(userId, limit, offset);

    return res.status(200).json(residents);
  } catch (error: any) {
    console.error('Get residents error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/residents/:id - Get resident by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const residentId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const resident = await ResidentService.getResidentById(residentId, userId);

    return res.status(200).json(resident);
  } catch (error: any) {
    console.error('Get resident error:', error.message);
    res.status(404).json({ error: error.message });
  }
});

// PUT /api/residents/:id - Update resident
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const residentId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const resident = await ResidentService.updateResident(residentId, userId, {
      name,
      email,
    });

    return res.status(200).json(resident);
  } catch (error: any) {
    console.error('Update resident error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/residents/:id - Delete resident
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const residentId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await ResidentService.deleteResident(residentId, userId);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Delete resident error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;
