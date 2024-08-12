import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtOptions, } from '../../types';


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
  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.options.secret) as JwtPayload;
      return decoded;
    } catch (error: any) {
      throw error
    }
  }

  // Refresh an existing JWT token (optional)
  refreshToken(token: string): string {
    const decoded = this.verifyToken(token);
    return this.issueToken(decoded);
  }
}

// // Example usage:
// const jwtService = new JwtService({
//   expiresIn: '1h', // Token expiry Time
//   secret: 'your_jwt_secret', // Replace with your JWT secret key
// });

// // Example usage:
// const userPayload: TokenPayload = {
//   userId: '123456',
//   username: 'john_doe',
// };

// const token = jwtService.issueToken(userPayload);
// console.log('Generated Token:', token);

// const decodedToken = jwtService.verifyToken(token);
// console.log('Decoded Token:', decodedToken);

// const refreshedToken = jwtService.refreshToken(token);
// console.log('Refreshed Token:', refreshedToken);
