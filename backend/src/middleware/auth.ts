import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err: any) {
    return res.status(403).json({ error: 'Invalid token', details: err.message });
  }
};

export const generateTokens = (userId: number, email: string) => {
  const payload = { id: userId, email };
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  } as SignOptions);

  return { accessToken };
};
