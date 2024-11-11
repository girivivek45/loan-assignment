import { Request } from 'express';
import { IUser } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      applicantId?: IUser;  // Updated from user to applicantId
      role?: string;        // Optional property remains the same
    }
  }
}
