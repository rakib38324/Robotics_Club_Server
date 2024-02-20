import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controller';
import Auth from '../../middlewares/Auth';

const router = express.Router();

router.post(
  '/login',
  ValidateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  Auth('Admin', 'User'),
  ValidateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword,
);

router.post(
  '/refresh-token',
  ValidateRequest(authValidations.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.post(
  '/forget-password',
  ValidateRequest(authValidations.forgetPasswordValidationSchema),
  authControllers.forgetPassword,
);

router.post(
  '/reset-password',
  ValidateRequest(authValidations.resetPasswordValidationSchema),
  authControllers.resetPassword,
);

export const loginRouters = router;
