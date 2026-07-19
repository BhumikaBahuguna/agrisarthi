import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { runDbQuery, mockUsers } from '../mockDb.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'agrisarthi_secret_fallback_key';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user with offline fallback support
    const user = await runDbQuery(
      prisma.user.findUnique({
        where: { id: decoded.userId }
      }),
      () => mockUsers.find(u => u.id === decoded.userId)
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.'
    });
  }
};
