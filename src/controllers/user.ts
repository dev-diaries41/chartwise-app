import { Request, Response } from 'express';
import { AuthErrors, ServerErrors } from '@src/constants/errors';
import { loginUser, registerUser } from '@src/services/auth';
import { UserSchema } from '@src/constants/schemas';
import { logger } from '@src/logger';


export async function login(req: Request, res: Response) {
  try {
    const {email, password} = req.body;
    const token = await loginUser(email, password);
    if(!token) return res.status(401).json({message: AuthErrors.INVALID_LOGIN_CRED})

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200); 
  } catch (error: any) {
    logger.error({message: 'Error in loginController', details: error.message}); 
    return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}

export async function register(req: Request, res: Response) {
    try {
      const validationResult = UserSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json(validationResult);
      }

      await registerUser(validationResult.data);
      return res.status(200).json({message: 'User registration successful'}); 
    } catch (error: any) {
      logger.error({message: 'Error in register', details: error.message}); 
      return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
    }
  }
  
