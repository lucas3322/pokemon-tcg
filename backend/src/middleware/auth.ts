import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pokemon_tcg_secret_key_change_in_prod';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
    req.userId = payload.userId;
    req.userEmail = payload.email;
    req.userName = payload.name;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export { JWT_SECRET };
