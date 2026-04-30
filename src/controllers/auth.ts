import type { Request, Response } from 'express';
import AuthService from '../services/auth.service.js';
import { ApiResponse } from '../utils/api-response.js';

class AuthController {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await this.authService.signupUser(name, email, password);
    return ApiResponse.created(res, 'Signup successful', { user });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.loginUser(email, password);
    return ApiResponse.ok(res, 'Login successful', result);
  };

  resetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.resetPassword(email);
    return ApiResponse.ok(res, 'If the email exists, a reset token has been sent');
  };

  newPassword = async (req: Request, res: Response) => {
    const { userId, resetToken, password } = req.body;
    await this.authService.updatePassword(userId, resetToken, password);
    return ApiResponse.ok(res, 'Password updated successfully');
  };
}

export default AuthController;
