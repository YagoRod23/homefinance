import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import { generateTokens, authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Create user
    const user = await AuthService.createUser(name, email, password);

    // Generate token
    const { accessToken } = generateTokens(user.id, user.email);

    return res.status(201).json({
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error.message);
    res.status(400).json({
      error: error.message || 'Registration failed',
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required',
      });
    }

    // Authenticate user
    const user = await AuthService.authenticateUser(email, password);

    // Generate token
    const { accessToken } = generateTokens(user.id, user.email);

    return res.status(200).json({
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error.message);

    if (error.message === 'User not found') {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    if (error.message === 'Invalid password') {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    res.status(500).json({
      error: error.message || 'Login failed',
    });
  }
});

// GET /api/auth/me (protected route example)
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Not authenticated',
    });
  }

  res.status(200).json({
    user: req.user,
  });
});

export default router;
