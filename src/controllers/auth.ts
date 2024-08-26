import { Request, Response } from 'express';
import { jwtService } from '@src/middleware';
import { ServerErrors } from '@src/constants/errors';
import { validateUserInfo } from '@src/utils/validation';

export async function refreshTokenController(req: Request, res: Response) {
  try {
    const validationResult = validateUserInfo(req);

    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error });
    }

    const token = jwtService.issueToken(validationResult.data);

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({ message: 'Token issued successfully' }); 
  } catch (error) {
    console.error('Error in refreshTokenController:', error);  // Log the error
    return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
  }
}
