const AuthService = require('../services/auth.service');
const asyncHandler = require('../middlewares/async-handler');
const { ApiResponse } = require('../utils/api-response');

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await AuthService.signupUser(name, email, password);
  return ApiResponse.created(res, 'Signup successful', { user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.loginUser(email, password);
  return ApiResponse.ok(res, 'Login successful', result);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await AuthService.resetPassword(email);
  return ApiResponse.ok(res, 'If the email exists, a reset token has been sent');
});

exports.newPassword = asyncHandler(async (req, res) => {
  const { userId, resetToken, password } = req.body;
  await AuthService.updatePassword(userId, resetToken, password);
  return ApiResponse.ok(res, 'Password updated successfully');
});
