import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser, JwtOptions, AddDocResponse, NewUser } from '@src/types';
import { hashPassword } from "@src/utils/cryptography";
import { User } from "../mongo/models/user";
import { addDoc } from "../mongo/utils/add";
import { getDoc } from "@src/mongo/utils/get";
import crypto from 'crypto';
import { cache } from '@src/index';
import { Time } from '@src/constants/server';
import { AuthErrors } from '@src/constants/errors';

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
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new Error(AuthErrors.INVALID_TOKEN);
      }
      return decoded;
    } catch (error: any) {
      throw error
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const exists = await cache.exists(token);
    return exists;
  }

  async invalidateToken(token?: string): Promise<void> {
    if(!token) return
    await cache.set(token, token, { ttl: Time.hour / 1000 });  // 1hr since token exp is 1hr
  }
}

export const auth = new JwtService({
  expiresIn: '1h',
  secret: 'your_jwt_secret',
});

export async function findUser(email: string){
  const result =  await getDoc(User, {email})
  if(!result.success || !result.data) return null;
  return result.data;
}

export async function loginUser(userEmail: string, password: string): Promise<string | null> {
  const user = await findUser(userEmail);  
  if(!user) return null;
  const {salt, hashedPassword, email, name, username } = user

  const verifyPassword = (storedHashedPassword: string, salt: string, inputPassword: string) => hashPassword(inputPassword, salt) === storedHashedPassword;
  const isValidPassword = verifyPassword(hashedPassword, salt, password);
  if(!isValidPassword) return null;
  const payload = {email, name, username };
  const token = auth.issueToken(payload);
  return token;
}

export async function registerUser(newUserInfo: NewUser): Promise<AddDocResponse> {
  const {password, ...userInfo} = newUserInfo
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt)
  const newUser: IUser = {...userInfo, hashedPassword, salt};
  return addDoc(User, newUser);
}

export async function logoutUser(token?: string): Promise<void> {
  await auth.invalidateToken(token);
}