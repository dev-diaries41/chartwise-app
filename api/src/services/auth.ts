
import { IUser } from '@src/types';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const SECRET_KEY = process.env.ACCESS_SECRET || 'your-secret-key'; 

declare global {
  namespace Express {
    interface Request {
      jwtPayload?: JwtPayload & Partial<IUser>;
    }
  }
}

export function issueToken(payload: Record<string, string>, options: SignOptions = { expiresIn:'1h' }): string {
    return jwt.sign(payload, SECRET_KEY, options);
}

export function verifyToken<T extends JwtPayload = JwtPayload>(token: string): T & JwtPayload {
    return jwt.verify(token, SECRET_KEY) as T & JwtPayload
}

