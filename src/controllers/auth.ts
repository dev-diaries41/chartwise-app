import { Request, Response } from 'express';
import { AuthErrors, ServerErrors } from '@src/constants/errors';
import * as AuthService from '@src/services/auth';


// // TODO: Update to reflect new user model
export async function refreshToken(req: Request, res: Response) {
  try {
    const {userId} = req.body;
    if (!userId) return res.status(400).json({ message: AuthErrors.INVALID_USER_ID });
    
    const token = AuthService.auth.issueToken({email: userId});
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({ message: 'Token issued successfully' }); 
  } catch (error) {
    console.error('Error in refreshTokenController:', error);  // Log the error
    return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}