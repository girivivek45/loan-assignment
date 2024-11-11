import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUser } from '../routes/role';

const adminMiddleware = (req: IGetUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET as string);
    
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    req.applicantId = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default adminMiddleware;
