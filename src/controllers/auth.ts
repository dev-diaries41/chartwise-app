import { Request, Response } from 'express';
import { AuthErrors, ServerErrors } from '@src/constants/errors';
import * as AuthService from '@src/services/auth';
import { UserSchema } from '@src/constants/schemas';
import { IUser } from '@src/types';

// TODO: Update to reflect new user model
export async function refreshToken(req: Request, res: Response) {
  try {
    const {user}: {user:Partial<IUser>} = req.body
    if (!user) return res.status(400).json({ message: AuthErrors.INVALID_USER_ID });
    
    const token = AuthService.auth.issueToken(user);
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({ message: 'Token issued successfully' }); 
  } catch (error) {
    console.error('Error in refreshTokenController:', error);  // Log the error
    return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const {email, password} = req.body;
    const token = await AuthService.loginUser(email, password);
    if(!token) return res.status(401).json({message: 'Invalid login credentials'})

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({message: 'Login successful'}); 
  } catch (error) {
    console.error('Error in loginController:', error); 
    return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function register(req: Request, res: Response) {
    try {
      const validationResult = UserSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json(validationResult);
      }

      await AuthService.registerUser(validationResult.data);
      return res.status(200).json({message: 'User registration successful'}); 
    } catch (error) {
      console.error('Error in registerController:', error);  // Log the error
      return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
    }
  }

  export async function logout(req: Request, res: Response) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: AuthErrors.INVALID_TOKEN });
      }
      await AuthService.logoutUser(token);
      return res.send(200); 
    } catch (error) {
      console.error('Error in registerController:', error);  // Log the error
      return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
    }
  }