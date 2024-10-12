import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser, JwtOptions } from '@src/types';

declare global {
  namespace Express {
    interface Request {
      jwtPayload?: JwtPayload & Partial<IUser>;
    }
  }
}

export class JwtService {
  private readonly options: JwtOptions;

  constructor(options: JwtOptions) {
    this.options = options;
  }

  // Issue a new JWT token
  issueToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.options.secret, {
      expiresIn: this.options.expiresIn,
    });
  }

  // Verify and decode a JWT token
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, this.options.secret) as JwtPayload;
      return decoded;
    } catch (error: any) {
      throw error
    }
  }
}

export const auth = new JwtService({
  expiresIn: '1h',
  secret: 'your_jwt_secret',
});