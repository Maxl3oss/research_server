import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
require("dotenv").config();
const TOKEN_SECRET = (process.env.TOKEN_SECRET || "") as string;
const prisma = new PrismaClient();

// Extend Request type to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verify(token, TOKEN_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user && user.role === 2 && user.id) {
      const fillUser = await prisma.user.findFirst({ where: { id: user.id, role_id: 2 } });
      if (fillUser) {
        return next();
      }
    }

    // If any condition fails, send a 403 Forbidden response
    res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    console.error('Error in authorizeAdmin middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};