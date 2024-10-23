
'use server'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

type TokenizedUrl = `${string}?token=${string}`;

const SECRET_KEY = process.env.ACCESS_SECRET || 'your-secret-key'; 

export async function generateAccessUrl(payload: Record<string, string>, baseUrl:string, options: SignOptions = { expiresIn:'1h' }) {
    const token = jwt.sign(payload, SECRET_KEY, options);
    return `${baseUrl}?token=${token}`;
}

export async function verifyToken<T extends JwtPayload = Record<string, any>>(token: string) {
    return jwt.verify(token, SECRET_KEY) as T
}

export async function isValidLogin(url: TokenizedUrl, expectedEmail: string) {
  try {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const token = urlParams.get('token');
    if (!token) throw new Error('Token not found in the URL');
      
    const {email} = await verifyToken<{ email: string}>(token);
    return expectedEmail === email;
  } catch (error: any) {
    console.error('Invalid token:', error.message);
    return false;
  }
}

