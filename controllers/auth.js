const AuthService = require('../services/auth.service');
const { ApiResponse } = require('../utils/api-response');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await this.authService.signupUser(name, email, password);
    return ApiResponse.created(res, 'Signup successful', { user });
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const result = await this.authService.loginUser(email, password);
    return ApiResponse.ok(res, 'Login successful', result);
  };

  resetPassword = async (req, res) => {
    const { email } = req.body;
    await this.authService.resetPassword(email);
    return ApiResponse.ok(res, 'If the email exists, a reset token has been sent');
  };

  newPassword = async (req, res) => {
    const { userId, resetToken, password } = req.body;
    await this.authService.updatePassword(userId, resetToken, password);
    return ApiResponse.ok(res, 'Password updated successfully');
  };
}

module.exports = AuthController;
