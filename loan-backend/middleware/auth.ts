import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUser } from '../routes/role';

interface JwtPayload {
  id: string;
  role: string;
}

export const authMiddleWare = (req: IGetUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = decodedToken.id;  
    req.role = decodedToken.role;      

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
