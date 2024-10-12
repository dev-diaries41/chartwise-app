
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

type TokenizedUrl = `${string}?token=${string}`;

const SECRET_KEY = process.env.ACCESS_SECRET || 'your-secret-key'; 
const BASE_URL = 'https://example.com/resource';

export function generateAccessUrl(payload: Record<string, string>, options: SignOptions = { expiresIn:'1h' }): TokenizedUrl {
    const token = jwt.sign(payload, SECRET_KEY, options);
    return `${BASE_URL}?token=${token}`;
}

export function verifyToken<T extends JwtPayload = Record<string, any>>(token: string): T {
    return jwt.verify(token, SECRET_KEY) as T
}

export function isValidLogin(url: TokenizedUrl, expectedEmail: string): boolean {
  try {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const token = urlParams.get('token');
    if (!token) throw new Error('Token not found in the URL');
      
    const {email} = verifyToken<{ email: string}>(token);
    return expectedEmail === email;
  } catch (error: any) {
    console.error('Invalid token:', error.message);
    return false;
  }
}

